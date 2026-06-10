import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOculosById, formatarPreco } from '../api';
import type { Oculos } from '../types';

export default function OculosDetail() {
  const { id } = useParams<{ id: string }>();
  const [oculos, setOculos] = useState<Oculos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchOculosById(id)
      .then(setOculos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !oculos) {
    return (
      <div className="detail-page">
        <div className="container">
          <p className="alert alert-erro">{error || 'Óculos não encontrado.'}</p>
          <Link to="/#ofertas" className="btn btn-primary">Voltar às ofertas</Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/5581981131116?text=${encodeURIComponent(
    `Olá! Tenho interesse no óculos ${oculos.nome} (${oculos.marca}) - ${formatarPreco(oculos.preco)}`
  )}`;

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/#ofertas" className="back-link">&larr; Voltar às ofertas</Link>

        <div className="detail-grid">
          <div className="detail-image">
            <img src={oculos.imagem} alt={oculos.nome} />
            {oculos.preco_original && (
              <span className="oculos-badge">Promoção</span>
            )}
          </div>

          <div className="detail-info">
            <span className="oculos-marca">{oculos.marca}</span>
            <h1>{oculos.nome}</h1>
            <p className="detail-desc">{oculos.descricao}</p>

            <div className="oculos-precos detail-precos">
              {oculos.preco_original && (
                <span className="preco-original">{formatarPreco(oculos.preco_original)}</span>
              )}
              <span className="preco-atual">{formatarPreco(oculos.preco)}</span>
            </div>

            <div className="detail-specs">
              <div className="spec-item">
                <span className="spec-label">Tipo</span>
                <span className="spec-value">{oculos.tipo}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Cor</span>
                <span className="spec-value">{oculos.cor}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Material</span>
                <span className="spec-value">{oculos.material}</span>
              </div>
            </div>

            <div className="detail-description">
              <h2>Descrição</h2>
              <p>{oculos.descricao_detalhada}</p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Tenho interesse — Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
