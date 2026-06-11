import { useEffect, useState, type FormEvent } from 'react';
import { adminCriarUsuario, adminExcluirUsuario, adminListarUsuarios } from '../../api';
import type { AdminUsuario } from '../../types';

interface Props {
  open: boolean;
  token: string;
  onClose: () => void;
}

export default function AdminUsuariosModal({ open, token, onClose }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  useEffect(() => {
    if (!open) return;

    setMensagem(null);
    setUsuario('');
    setSenha('');
    setLoadingList(true);

    adminListarUsuarios(token)
      .then(setUsuarios)
      .catch(() => setMensagem({ tipo: 'erro', texto: 'Erro ao carregar usuários.' }))
      .finally(() => setLoadingList(false));
  }, [open, token]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (!/^\d{6}$/.test(senha)) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter exatamente 6 dígitos.' });
      return;
    }

    setLoading(true);
    try {
      const novo = await adminCriarUsuario(usuario.trim(), senha, token);
      setUsuarios((prev) => [...prev, novo]);
      setMensagem({ tipo: 'sucesso', texto: `Usuário "${novo.usuario}" criado com sucesso.` });
      setUsuario('');
      setSenha('');
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao criar usuário.',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSenhaChange(value: string) {
    setSenha(value.replace(/\D/g, '').slice(0, 6));
  }

  async function handleExcluir(id: number, nome: string) {
    if (!window.confirm(`Deseja excluir o usuário "${nome}"?`)) return;

    setMensagem(null);
    try {
      await adminExcluirUsuario(id, token);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setMensagem({ tipo: 'sucesso', texto: `Usuário "${nome}" excluído.` });
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao excluir usuário.',
      });
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Novo usuário</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Fechar">
            &times;
          </button>
        </div>

        {mensagem && (
          <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="novo-usuario">Usuário</label>
            <input
              id="novo-usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nova-senha">Senha (6 dígitos)</label>
            <input
              id="nova-senha"
              type="password"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={senha}
              onChange={(e) => handleSenhaChange(e.target.value)}
              autoComplete="new-password"
              required
            />
            <span className="file-hint">{senha.length}/6 dígitos</span>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar usuário'}
          </button>
        </form>

        <div className="admin-usuarios-list">
          <h3>Usuários cadastrados</h3>
          {loadingList ? (
            <p className="loading-text">Carregando...</p>
          ) : usuarios.length === 0 ? (
            <p className="admin-empty">Nenhum usuário cadastrado.</p>
          ) : (
            <ul>
              {usuarios.map((item) => (
                <li key={item.id} className="admin-usuario-item">
                  <div className="admin-usuario-info">
                    <strong>{item.usuario}</strong>
                    <span>{new Date(item.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(item.id, item.usuario)}
                    disabled={usuarios.length <= 1}
                    title={usuarios.length <= 1 ? 'Não é possível excluir o último usuário' : undefined}
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
