"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';

export default function ProdutosPage() {
  const router = useRouter();
  const { favoritos, toggleFavorito, logout } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Estados de Ordenação e Filtro
  const [sortBy, setSortBy] = useState<'preco-asc' | 'preco-desc' | 'nome-az' | 'nome-za' | ''>('');
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Debounce para busca
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(debouncedTerm), 500);
    return () => clearTimeout(handler);
  }, [debouncedTerm]);

  // Consumo da API com React Query (Requisito obrigatório)
  const { data: produtos = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['produtos', searchTerm],
    queryFn: async () => {
      const token = Cookies.get('auth-token');
      const isSearch = searchTerm.trim() !== '';
      const url = 'https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/produtos/listar';
      
      const response = await fetch(url, {
        method: isSearch ? 'POST' : 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        ...(isSearch && { 
          body: JSON.stringify({ nome_produto: isNaN(Number(searchTerm)) ? searchTerm : "", codigo_produto: !isNaN(Number(searchTerm)) ? searchTerm : "" }) 
        })
      });

      if (response.status === 401) { logout(); router.push('/login'); throw new Error('Unauthorized'); }
      return response.json();
    },
    enabled: mounted
  });

  // Lógica de Ordenação e Filtro Local
  const produtosProcessados = useMemo(() => {
    let lista = Array.isArray(produtos) ? [...produtos] : [];
    if (mostrarFavoritos) lista = lista.filter(p => favoritos.includes(p.codigo));
    
    return lista.sort((a, b) => {
      if (sortBy === 'preco-asc') return Number(a.preco) - Number(b.preco);
      if (sortBy === 'preco-desc') return Number(b.preco) - Number(a.preco);
      if (sortBy === 'nome-az') return a.nome.localeCompare(b.nome);
      if (sortBy === 'nome-za') return b.nome.localeCompare(a.nome);
      return 0;
    });
  }, [produtos, mostrarFavoritos, favoritos, sortBy]);

  const formatBRL = (val: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      
      <header className="w-full bg-[#83C001] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-[#83C001] font-black text-xl italic leading-none">in</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tighter uppercase">innovation</span>
                <span className="text-[10px] font-bold tracking-[0.2em] opacity-90 uppercase ml-0.5">Brindes</span>
              </div>
            </div>
          </div>

          <div className="w-full md:flex-1 md:px-10">
            <div className="relative max-w-2xl mx-auto w-full group">
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou código..." 
                className="w-full bg-white/20 border border-white/30 rounded-full py-2.5 px-12 text-sm placeholder-white/80 outline-none focus:bg-white focus:text-gray-700 transition-all"
                value={debouncedTerm} onChange={(e) => setDebouncedTerm(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="font-bold text-sm leading-none">Ana Carol Machado</p>
              <p className="text-[10px] opacity-90 mt-1 uppercase italic">Quarta, 23/09/2020</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden"></div>
            <button onClick={() => { logout(); Cookies.remove('auth-token'); router.push('/login'); }} className="hover:opacity-75">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* FILTROS E ORDENAÇÃO (Obrigatório) */}
      <div className="max-w-[1400px] mx-auto w-full px-4 pt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select onChange={(e) => setSortBy(e.target.value as any)} className="border rounded-lg p-2 text-sm outline-[#83C001]">
              <option value="">Ordenar por...</option>
              <option value="preco-asc">Menor Preço</option>
              <option value="preco-desc">Maior Preço</option>
              <option value="nome-az">Nome A-Z</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-600">
              <input type="checkbox" checked={mostrarFavoritos} onChange={(e) => setMostrarFavoritos(e.target.checked)} className="accent-[#83C001] w-4 h-4" />
              Apenas Favoritos
            </label>
          </div>
          {isError && <button onClick={() => refetch()} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold">Tentar Novamente</button>}
        </div>
      </div>

      {/* GRID DE PRODUTOS */}
      <main className="max-w-[1400px] mx-auto w-full p-4 md:p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5">
            {produtosProcessados.map((p) => (
              <div key={p.codigo} className="bg-white border border-gray-100 p-3 flex flex-col relative group shadow-sm hover:shadow-xl transition-all rounded-lg overflow-hidden">
                <button onClick={() => toggleFavorito(p.codigo)} className={`absolute top-2 left-2 z-10 text-xl ${favoritos.includes(p.codigo) ? 'text-red-500' : 'text-gray-300'}`}>
                  {favoritos.includes(p.codigo) ? '❤️' : '🤍'}
                </button>
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 uppercase">EXCLUSIVO!</span>
                <div className="aspect-square bg-gray-50 mb-3 p-4 flex items-center justify-center rounded-md">
                  <img src={p.imagem} className="max-h-full object-contain mix-blend-multiply" alt={p.nome} />
                </div>
                <h3 className="text-[10px] font-bold uppercase truncate text-gray-700">{p.nome}</h3>
                <p className="text-[9px] text-gray-400">Cód: {p.codigo}</p>
                <div className="mt-auto pt-4 flex flex-col items-end">
                  <p className="text-[8px] text-gray-400 italic leading-none">a partir de</p>
                  <p className="text-[#83C001] font-black text-xl leading-tight">{formatBRL(p.preco)}</p>
                  <button onClick={() => setSelectedProduct(p)} className="w-full bg-[#83C001] text-white text-[10px] font-bold py-2.5 mt-3 uppercase rounded-md shadow-md">Confira</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL ACESSÍVEL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-gray-800">{selectedProduct.nome}</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-4xl text-gray-200 hover:text-gray-400">&times;</button>
            </div>
            <img src={selectedProduct.imagem} className="w-full h-64 object-contain mb-6" alt="" />
            <div className="bg-[#83C001]/10 p-5 rounded-2xl flex justify-between items-center">
              <span className="text-[#83C001] text-3xl font-black">{formatBRL(selectedProduct.preco)}</span>
              <span className="text-sm font-bold">Ref: {selectedProduct.codigo}</span>
            </div>
            <button onClick={() => setSelectedProduct(null)} className="w-full mt-8 bg-[#83C001] text-white py-4 rounded-2xl font-black uppercase tracking-widest">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}