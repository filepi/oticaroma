import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminAtualizarOculos,
  adminCadastrarOculos,
  adminExcluirOculos,
  adminLogout,
  fetchOculos,
  formatarPreco,
} from '../../api';
import { useAuth } from '../../context/AuthContext';
import type { Oculos } from '../../types';
import AdminUsuariosModal from '../../components/admin/AdminUsuariosModal';

const emptyForm = {
  nome: '',
  marca: '',
  preco: '',
  preco_original: '',
  descricao: '',
  descricao_detalhada: '',
  cor: '',
  material: '',
  tipo: 'Solar',
};

function oculosToForm(item: Oculos) {
  return {
    nome: item.nome,
    marca: item.marca,
    preco: String(item.preco),
    preco_original: item.preco_original != null ? String(item.preco_original) : '',
    descricao: item.descricao,
    descricao_detalhada: item.descricao_detalhada,
    cor: item.cor,
    material: item.material,
    tipo: item.tipo,
  };
}

export default function AdminOfertas() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState<Oculos[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );
  const [usuariosModalOpen, setUsuariosModalOpen] = useState(false);

  const isEditing = editingId !== null;

  async function carregarOfertas() {
    setLoading(true);
    try {
      const data = await fetchOculos();
      setOfertas(data);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar ofertas.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarOfertas();
  }, []);

  function resetForm() {
    setEditingId(null);
    setImagemAtual(null);
    setForm(emptyForm);
    setImagem(null);
    const input = document.getElementById('imagem') as HTMLInputElement;
    if (input) input.value = '';
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImagemChange(e: ChangeEvent<HTMLInputElement>) {
    setImagem(e.target.files?.[0] ?? null);
  }

  function handleEditar(item: Oculos) {
    setEditingId(item.id);
    setImagemAtual(item.imagem);
    setForm(oculosToForm(item));
    setImagem(null);
    setMensagem(null);
    const input = document.getElementById('imagem') as HTMLInputElement;
    if (input) input.value = '';
    document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMensagem(null);

    if (!isEditing && !imagem) {
      setMensagem({ tipo: 'erro', texto: 'Selecione uma imagem do produto.' });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '') formData.append(key, value);
    });
    if (imagem) formData.append('imagem', imagem);

    setSaving(true);
    try {
      if (isEditing) {
        await adminAtualizarOculos(editingId, formData, token);
        setMensagem({ tipo: 'sucesso', texto: 'Oferta atualizada com sucesso!' });
      } else {
        await adminCadastrarOculos(formData, token);
        setMensagem({ tipo: 'sucesso', texto: 'Oferta cadastrada com sucesso!' });
      }
      resetForm();
      await carregarOfertas();
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao salvar oferta.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleExcluir(id: number) {
    if (!token) return;
    if (!window.confirm('Deseja remover esta oferta?')) return;

    try {
      await adminExcluirOculos(id, token);
      if (editingId === id) resetForm();
      setMensagem({ tipo: 'sucesso', texto: 'Oferta removida.' });
      await carregarOfertas();
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao remover oferta.',
      });
    }
  }

  async function handleLogout() {
    if (token) {
      try {
        await adminLogout(token);
      } catch {
        // ignora erro de logout remoto
      }
    }
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-page">
      <div className="container admin-container">
        <header className="admin-header">
          <div>
            <h1>Gerenciar Ofertas</h1>
            <p className="admin-subtitle">Cadastre e edite os óculos exibidos no site.</p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="btn btn-outline admin-logout-btn"
              onClick={() => setUsuariosModalOpen(true)}
            >
              Usuários
            </button>
            <button type="button" className="btn btn-outline admin-logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {token && (
          <AdminUsuariosModal
            open={usuariosModalOpen}
            token={token}
            onClose={() => setUsuariosModalOpen(false)}
          />
        )}

        {mensagem && (
          <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}>
            {mensagem.texto}
          </div>
        )}

        <div className="admin-grid">
          <form className="admin-form clube-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Editar oferta' : 'Nova oferta'}</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input id="marca" name="marca" type="text" value={form.marca} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco">Preço (R$)</label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.preco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preco_original">Preço original (opcional)</label>
                <input
                  id="preco_original"
                  name="preco_original"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.preco_original}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição curta</label>
              <input
                id="descricao"
                name="descricao"
                type="text"
                value={form.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao_detalhada">Descrição detalhada</label>
              <textarea
                id="descricao_detalhada"
                name="descricao_detalhada"
                rows={4}
                value={form.descricao_detalhada}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cor">Cor</label>
                <input id="cor" name="cor" type="text" value={form.cor} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  id="material"
                  name="material"
                  type="text"
                  value={form.material}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
                  <option value="Solar">Solar</option>
                  <option value="Grau">Grau</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="imagem">
                {isEditing ? 'Nova imagem (opcional)' : 'Imagem do produto'}
              </label>
              {isEditing && imagemAtual && !imagem && (
                <img src={imagemAtual} alt="Imagem atual" className="admin-form-preview" />
              )}
              <input
                id="imagem"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImagemChange}
                required={!isEditing}
              />
              <span className="file-hint">JPG, PNG ou WEBP. Máximo 5MB.</span>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar oferta'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline admin-cancel-btn" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="admin-list">
            <h2>Ofertas cadastradas</h2>
            {loading ? (
              <p className="loading-text">Carregando...</p>
            ) : ofertas.length === 0 ? (
              <p className="admin-empty">Nenhuma oferta cadastrada.</p>
            ) : (
              <ul className="admin-ofertas-list">
                {ofertas.map((item) => (
                  <li
                    key={item.id}
                    className={`admin-oferta-item${editingId === item.id ? ' admin-oferta-item-active' : ''}`}
                  >
                    <img src={item.imagem} alt={item.nome} className="admin-oferta-thumb" />
                    <div className="admin-oferta-info">
                      <strong>{item.nome}</strong>
                      <span>{item.marca}</span>
                      <span>{formatarPreco(item.preco)}</span>
                    </div>
                    <div className="admin-oferta-actions">
                      <button
                        type="button"
                        className="btn btn-edit"
                        onClick={() => handleEditar(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleExcluir(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
