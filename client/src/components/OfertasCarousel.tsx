import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchOculos, formatarPreco } from '../api';
import type { Oculos } from '../types';

export default function OfertasCarousel() {
  const [oculos, setOculos] = useState<Oculos[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOculos()
      .then(setOculos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % oculos.length);
  }, [oculos.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + oculos.length) % oculos.length);
  }, [oculos.length]);

  useEffect(() => {
    if (oculos.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [oculos.length, next]);

  if (loading) {
    return (
      <section id="ofertas" className="section ofertas">
        <div className="container">
          <h2 className="section-title">Nossas Ofertas</h2>
          <p className="loading-text">Carregando ofertas...</p>
        </div>
      </section>
    );
  }

  const visibleCount = Math.min(3, oculos.length);
  const visible = Array.from({ length: visibleCount }, (_, i) => {
    const index = (current + i) % oculos.length;
    return oculos[index];
  });

  return (
    <section id="ofertas" className="section ofertas">
      <div className="container">
        <h2 className="section-title">Nossas Ofertas</h2>
        <p className="section-subtitle">
          Confira nossa seleção de óculos com preços especiais. Clique para ver mais detalhes.
        </p>

        <div className="carousel">
          <button className="carousel-btn carousel-btn-prev" onClick={prev} aria-label="Anterior">
            &#8249;
          </button>

          <div className="carousel-track">
            {visible.map((item) => (
              <Link to={`/oculos/${item.id}`} key={item.id} className="oculos-card">
                <div className="oculos-card-image">
                  <img src={item.imagem} alt={item.nome} loading="lazy" />
                  {item.preco_original && (
                    <span className="oculos-badge">Promoção</span>
                  )}
                </div>
                <div className="oculos-card-body">
                  <span className="oculos-marca">{item.marca}</span>
                  <h3>{item.nome}</h3>
                  <p className="oculos-desc">{item.descricao}</p>
                  <div className="oculos-precos">
                    {item.preco_original && (
                      <span className="preco-original">{formatarPreco(item.preco_original)}</span>
                    )}
                    <span className="preco-atual">{formatarPreco(item.preco)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={next} aria-label="Próximo">
            &#8250;
          </button>
        </div>

        <div className="carousel-dots">
          {oculos.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
