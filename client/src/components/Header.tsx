import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/image.png';

type NavHashItem = { label: string; href: string };
type NavRouteItem = { label: string; to: string };
type NavItem = NavHashItem | NavRouteItem;

const navItems: NavItem[] = [
  { label: 'Início', href: '#inicio' },
  { label: 'Nossas Ofertas', href: '#ofertas' },
  { label: 'Clube de Benefícios', href: '#clube' },
  { label: 'Fale Conosco', href: '#contato' },
  { label: 'Admin', to: '/admin/login' },
];

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  function handleNav(href: string) {
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <img src={logo} alt="Ótica Roma" className="logo-img" />
        </Link>

        <nav className="nav">
          {navItems.map((item) =>
            'to' in item ? (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${location.pathname.startsWith(item.to) ? ' nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ) : isHome ? (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.href);
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={{ pathname: '/', hash: item.href.replace('#', '') }}
                className="nav-link"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
