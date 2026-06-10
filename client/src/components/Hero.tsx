export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="hero-badge">Sua visão, nossa paixão</span>
        <h1>Ótica Roma</h1>
        <p>
          Encontre os melhores óculos com qualidade, estilo e preços especiais.
          Faça parte do nosso Clube de Benefícios e aproveite vantagens exclusivas.
        </p>
        <div className="hero-actions">
          <a href="#ofertas" className="btn btn-primary">Ver Ofertas</a>
          <a href="#clube" className="btn btn-outline">Clube de Benefícios</a>
        </div>
      </div>
    </section>
  );
}
