import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import OculosDetail from './pages/OculosDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const isAdminArea =
    location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <>
      {!isAdminArea && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oculos/:id" element={<OculosDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <ProtectedRoute>
                <AdminProdutos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminArea && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
