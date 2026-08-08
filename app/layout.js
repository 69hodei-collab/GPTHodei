export const metadata = {
  title: 'GPTHodei Lab',
  description: 'Laboratorio GitHub + Vercel de iHodei',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
