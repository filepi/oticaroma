import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import OculosDetail from './pages/OculosDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOfertas from './pages/admin/AdminOfertas';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin';

  return (
    <>
      {!isAdminDashboard && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oculos/:id" element={<OculosDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminOfertas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminDashboard && <Footer />}
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
