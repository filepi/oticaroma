import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Nossas Ofertas', href: '#ofertas' },
  { label: 'Clube de Benefícios', href: '#clube' },
  { label: 'Fale Conosco', href: '#contato' },
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
          <span className="logo-icon">👓</span>
          <div>
            <span className="logo-name">Ótica Roma</span>
            <span className="logo-tagline">Visão com estilo</span>
          </div>
        </Link>

        <nav className="nav">
          {navItems.map((item) =>
            isHome ? (
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
