# 📦 Innovation Brindes - Catálogo de Produtos

Projeto desenvolvido como Teste Prático para Front-end, focado em alta performance, fidelidade visual e boas práticas de arquitetura utilizando Next.js 14.

## 🚀 Demonstração


https://github.com/user-attachments/assets/d5644661-15d9-4118-adb3-48b1362834dc

## Lighthouse
<img width="1901" height="948" alt="image" src="https://github.com/user-attachments/assets/fa0a8e32-c780-4d8b-88f5-f522e5776e58" />


## 🛠️ Tecnologias e Decisões Técnicas

Para este desafio, foram escolhidas tecnologias que garantem escalabilidade e uma experiência de usuário fluida:

- **Next.js 14 (App Router)**: Escolhido pela eficiência no roteamento e facilidade na separação de Server e Client Components.
- **Zustand**: Utilizado para o gerenciamento de estado global (Autenticação e Favoritos) por ser extremamente leve e performático.
- **TanStack Query (React Query)**: Implementado para o consumo da API, garantindo cache inteligente, revalidação automática e estados de carregamento (Skeletons) nativos.
- **Tailwind CSS**: Utilizado para garantir 100% de fidelidade ao layout proposto, com design responsivo Mobile-First.
- **Middleware**: Camada de segurança no nível do servidor que protege a rota `/produtos`, validando o token antes mesmo da página carregar.
- **Vitest + Testing Library**: Testes unitários focados na integridade dos componentes de UI.

## ✅ Requisitos Implementados

- [x] **Login**: Sistema de autenticação com persistência de token (Cookies e Store).
- [x] **Grid Responsivo**: Listagem fiel às referências visuais com selo "Exclusivo" e formatação BRL.
- [x] **Busca com Debounce**: Filtro por nome ou código que evita requisições excessivas à API.
- [x] **Ordenação Local**: Opções para ordenar por Menor/Maior Preço e Nome (A-Z).
- [x] **Sistema de Favoritos**: Persistência no `localStorage` para manter os dados após o reload.
- [x] **Detalhes do Produto**: Modal acessível e detalhado com fechamento via tecla ESC e clique externo.
- [x] **Dockerização**: Aplicação pronta para deploy em containers.

## 🐳 Como Rodar com Docker

A aplicação possui um `Dockerfile` configurado para produção. Para rodar:

```bash
# 1. Build da imagem
docker build -t innova-frontend .

# 2. Execução do container
docker run -p 3000:3000 innova-frontend
