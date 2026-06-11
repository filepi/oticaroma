import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

function IconUsuarios() {
  return (
    <svg className="admin-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProdutos() {
  return (
    <svg className="admin-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="7" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="9" width="7" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M3 11.5H1.5M22.5 11.5H21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminHome() {
  return (
    <AdminLayout title="Painel Administrativo" subtitle="Selecione uma opção para gerenciar">
      <div className="admin-menu-grid">
        <Link to="/admin/usuarios" className="admin-menu-card admin-menu-card--usuarios">
          <span className="admin-menu-icon-wrap">
            <IconUsuarios />
          </span>
          <h2>Usuários</h2>
          <p>Cadastrar, listar e excluir acessos ao painel</p>
        </Link>
        <Link to="/admin/produtos" className="admin-menu-card admin-menu-card--produtos">
          <span className="admin-menu-icon-wrap">
            <IconProdutos />
          </span>
          <h2>Produtos</h2>
          <p>Cadastrar, editar e remover óculos das ofertas</p>
        </Link>
      </div>
    </AdminLayout>
  );
}
