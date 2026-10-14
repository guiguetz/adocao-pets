import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adoção de Pets',
  description: 'Plataforma open-source de adoção, apadrinhamento e resgate animal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
