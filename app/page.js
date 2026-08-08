export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f5f5', padding: 24 }}>
      <section style={{ maxWidth: 760, background: 'white', padding: 48, borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}>
        <p style={{ fontWeight: 700, letterSpacing: 1 }}>iHODEI · LAB</p>
        <h1 style={{ fontSize: 48, marginBottom: 16 }}>GitHub + Vercel funcionando 🚀</h1>
        <p style={{ fontSize: 20, lineHeight: 1.6 }}>
          Este es el primer despliegue de GPTHodei. A partir de aquí podemos construir prototipos, MVPs y aplicaciones reales con un flujo profesional de desarrollo.
        </p>
        <p style={{ marginTop: 32 }}>Repositorio: 69hodei-collab/GPTHodei</p>
      </section>
    </main>
  );
}
