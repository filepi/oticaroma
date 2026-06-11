import { useEffect, useState, type FormEvent } from 'react';
import {
  adminAtualizarUsuario,
  adminCriarUsuario,
  adminExcluirUsuario,
  adminListarUsuarios,
} from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import type { AdminNivel, AdminUsuario } from '../../types';

const nivelLabel: Record<AdminNivel, string> = {
  admin: 'Admin',
  operacional: 'Operacional',
};

export default function AdminUsuarios() {
  const { token, isAdmin } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nivel, setNivel] = useState<AdminNivel>('operacional');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  const isEditing = editingId !== null;

  async function carregarUsuarios() {
    if (!token) return;
    setLoadingList(true);
    try {
      const data = await adminListarUsuarios(token);
      setUsuarios(data);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar usuários.' });
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, [token]);

  function resetForm() {
    setEditingId(null);
    setUsuario('');
    setSenha('');
    setNivel('operacional');
  }

  function handleEditar(item: AdminUsuario) {
    setEditingId(item.id);
    setUsuario(item.usuario);
    setSenha('');
    setNivel(item.nivel);
    setMensagem(null);
    document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || !isAdmin) return;
    setMensagem(null);

    if (!isEditing && !/^\d{6}$/.test(senha)) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter exatamente 6 dígitos.' });
      return;
    }

    if (isEditing && senha && !/^\d{6}$/.test(senha)) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter exatamente 6 dígitos.' });
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        const atualizado = await adminAtualizarUsuario(
          editingId,
          {
            usuario: usuario.trim(),
            nivel,
            ...(senha ? { senha } : {}),
          },
          token
        );
        setUsuarios((prev) => prev.map((u) => (u.id === editingId ? atualizado : u)));
        setMensagem({ tipo: 'sucesso', texto: `Usuário "${atualizado.usuario}" atualizado.` });
      } else {
        const novo = await adminCriarUsuario(usuario.trim(), senha, nivel, token);
        setUsuarios((prev) => [...prev, novo]);
        setMensagem({ tipo: 'sucesso', texto: `Usuário "${novo.usuario}" criado com sucesso.` });
      }
      resetForm();
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao salvar usuário.',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSenhaChange(value: string) {
    setSenha(value.replace(/\D/g, '').slice(0, 6));
  }

  async function handleExcluir(id: number, nome: string) {
    if (!token) return;
    if (!window.confirm(`Deseja excluir o usuário "${nome}"?`)) return;

    setMensagem(null);
    try {
      await adminExcluirUsuario(id, token);
      if (editingId === id) resetForm();
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
    <AdminLayout
      title="Usuários"
      subtitle="Gerencie os acessos ao painel administrativo"
      showBack
    >
      {mensagem && (
        <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className={`admin-grid${isAdmin ? '' : ' admin-grid-single'}`}>
        {isAdmin && (
          <form className="admin-form clube-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Editar usuário' : 'Novo usuário'}</h2>

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
              <label htmlFor="nova-senha">
                {isEditing ? 'Nova senha (opcional)' : 'Senha (6 dígitos)'}
              </label>
              <input
                id="nova-senha"
                type="password"
                inputMode="numeric"
                pattern={isEditing ? undefined : '\\d{6}'}
                maxLength={6}
                value={senha}
                onChange={(e) => handleSenhaChange(e.target.value)}
                autoComplete="new-password"
                required={!isEditing}
              />
              <span className="file-hint">
                {isEditing
                  ? senha
                    ? `${senha.length}/6 dígitos`
                    : 'Deixe em branco para manter a senha atual'
                  : `${senha.length}/6 dígitos`}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="nivel">Nível de acesso</label>
              <select
                id="nivel"
                value={nivel}
                onChange={(e) => setNivel(e.target.value as AdminNivel)}
                required
              >
                <option value="operacional">Operacional</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar usuário'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline admin-cancel-btn" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        <section className="admin-list">
          <h2>Usuários cadastrados</h2>
          {!isAdmin && (
            <p className="admin-hint">Apenas administradores podem criar novos usuários.</p>
          )}
          {loadingList ? (
            <p className="loading-text">Carregando...</p>
          ) : usuarios.length === 0 ? (
            <p className="admin-empty">Nenhum usuário cadastrado.</p>
          ) : (
            <ul className="admin-usuarios-list">
              {usuarios.map((item) => (
                <li
                  key={item.id}
                  className={`admin-usuario-item${editingId === item.id ? ' admin-usuario-item-active' : ''}`}
                >
                  <div className="admin-usuario-info">
                    <strong>{item.usuario}</strong>
                    <span className={`admin-nivel-badge admin-nivel-badge--${item.nivel}`}>
                      {nivelLabel[item.nivel]}
                    </span>
                    <span>{new Date(item.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {isAdmin && (
                    <div className="admin-oferta-actions">
                      <button
                        type="button"
                        className="btn btn-edit btn-sm"
                        onClick={() => handleEditar(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleExcluir(item.id, item.usuario)}
                        disabled={usuarios.length <= 1}
                        title={
                          usuarios.length <= 1
                            ? 'Não é possível excluir o último usuário'
                            : undefined
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
