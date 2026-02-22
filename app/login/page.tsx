"use client";

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manterLogado, setManterLogado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/login/acessar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (data.status === 1) {
        setToken(data.token_de_acesso);
        Cookies.set('auth-token', data.token_de_acesso, { expires: manterLogado ? 7 : 1 });
        router.push('/produtos');
      } else {
        setError(data.message || 'Erro ao entrar. Verifique seus dados.');
      }
    } catch (err) {
      setError('Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-white">
      <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: "url('/images/fundoLogin.webp')" }}>
        <div className="absolute inset-0 bg-white/5"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-center mb-10 md:mb-16 text-primary">
          Bem-vindo a <br className="md:hidden" /> Innovation Brindes
        </h1>

        <div className="w-full bg-primary rounded-[20px] shadow-2xl overflow-hidden">
          <div className="px-6 py-10 md:px-20 lg:pt-40 lg:pb-14">
            <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
              <div className="w-full relative">
                <div className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2">
                   <svg fill="#5E5E5E" className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 52 52"><path d="M50,43v2.2c0,2.6-2.2,4.8-4.8,4.8H6.8C4.2,50,2,47.8,2,45.2V43c0-5.8,6.8-9.4,13.2-12.2c0.2-0.1,0.4-0.2,0.6-0.3c0.5-0.2,1-0.2,1.5,0.1c2.6,1.7,5.5,2.6,8.6,2.6s6.1-1,8.6-2.6c0.5-0.3,1-0.3,1.5-0.1c0.2,0.1,0.4,0.2,0.6,0.3C43.2,33.6,50,37.1,50,43z M26,2c6.6,0,11.9,5.9,11.9,13.2S32.6,28.4,26,28.4s-11.9-5.9-11.9-13.2S19.4,2,26,2z"/></svg>
                </div>
                <input type="text" placeholder="Usuário" className="w-full bg-white rounded-full py-4 md:py-6 pl-14 md:pl-26 pr-6 text-accent font-semibold text-lg md:text-2xl outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              
              <div className="w-full relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <svg width="24px" height="24px" className="w-4 h-4 md:w-8 md:h-8" viewBox="0 0 48 48"><g fill="#5E5E5E"><circle cx="24" cy="28" r="2"/><path d="M12,44h24c2.2,0,4-1.8,4-4V22c0-2.2-1.8-4-4-4H18v-4c0-3.309,2.691-6,6-6s6,2.691,6,6h4c0-5.514-4.486-10-10-10S14,8.486,14,14v4h-2c-2.2,0-4,1.8-4,4v18C8,42.2,9.8,44,12,44z M12,22h24v18H12V22z"/></g></svg>
                </div>
                <input type="password" placeholder="Senha" className="w-full bg-white rounded-full py-4 md:py-6 pl-14 md:pl-26 pr-6 text-accent font-semibold text-lg md:text-2xl outline-none" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              </div>

              <div className="w-full flex items-center justify-between text-xs md:text-lg text-white px-2">
                <div className="flex items-center cursor-pointer select-none" onClick={() => setManterLogado(!manterLogado)}>
                  <div className="w-4 h-4 border-2 border-white flex items-center justify-center mr-2">
                    {manterLogado && <span>✓</span>}
                  </div>
                  <span>Manter logado</span>
                </div>
                <button type="button" className="hover:underline">Esqueceu a senha?</button>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="bg-white rounded-full py-4 md:py-6 px-16 md:px-28 text-accent text-xl md:text-2xl font-bold shadow-xl transition-all hover:scale-105">
                  {loading ? '...' : 'Login'}
                </button>
              </div>
              {error && <p className="text-white font-bold">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}