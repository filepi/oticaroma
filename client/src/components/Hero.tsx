import logo from '../assets/logo.png';

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h1 className="hero-logo-heading">
          <img src={logo} alt="Ótica Roma" className="hero-logo" />
        </h1>
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
