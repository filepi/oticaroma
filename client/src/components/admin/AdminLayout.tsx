import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { adminLogout } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: ReactNode;
}

export default function AdminLayout({ title, subtitle, showBack = false, children }: Props) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

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
            {showBack && (
              <Link to="/admin" className="admin-back-link">
                &larr; Voltar ao painel
              </Link>
            )}
            <h1>{title}</h1>
            {subtitle && <p className="admin-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="btn btn-outline admin-logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
