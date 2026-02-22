import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
import ClientWrapper from "./client-wrapper"; 

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});


export const metadata: Metadata = {
  title: "Innovation Brindes | Catálogo de Produtos",
  description: "Explore nossa linha exclusiva de brindes personalizados. Qualidade e inovação para sua marca.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={montserrat.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}