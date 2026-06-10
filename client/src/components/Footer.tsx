export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-name">Ótica Roma</span>
          <p>Cuidando da sua visão com qualidade e carinho desde sempre.</p>
        </div>
        <div className="footer-info">
          <p>Rua da Hora, 456 - Espinheiro, Recife - PE, 52020-010</p>
          <p>WhatsApp: (81) 98113-1116</p>
          <p>&copy; {new Date().getFullYear()} Ótica Roma. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
