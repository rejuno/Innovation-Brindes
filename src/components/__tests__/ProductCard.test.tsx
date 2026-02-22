import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Simulação de um componente simples de Card para o teste
const ProductCard = ({ nome, preco }: { nome: string; preco: number }) => {
  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    
  return (
    <div>
      <h3>{nome}</h3>
      <span>{formatBRL(preco)}</span>
    </div>
  );
};

describe('ProductCard Component', () => {
  it('deve renderizar o nome do produto e o preço formatado em BRL', () => {
    render(<ProductCard nome="COPO TESTE" preco={4.50} />);
    
    // Verifica se o nome aparece
    expect(screen.getByText('COPO TESTE')).toBeInTheDocument();
    
    // Verifica se o preço está formatado (R$ 4,50)
    // Usamos um regex pois o caractere de espaço do Intl às vezes é diferente
    expect(screen.getByText(/R\$\s?4,50/)).toBeInTheDocument();
  });
});