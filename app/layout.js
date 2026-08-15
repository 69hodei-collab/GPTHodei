import "./globals.css";

export const metadata = {
  title: "CEO Command Center | iHODEI",
  description: "Copiloto ejecutivo para convertir señales de negocio en decisiones y acciones.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
