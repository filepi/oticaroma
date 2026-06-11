import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const { token } = await adminLogin(usuario, senha);
      login(token);
      navigate('/admin');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-login-card">
        <h1>Área Administrativa</h1>
        <p className="admin-subtitle">Faça login para gerenciar as ofertas da loja.</p>

        {erro && <div className="alert alert-erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
