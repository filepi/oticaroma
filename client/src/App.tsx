import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OculosDetail from './pages/OculosDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oculos/:id" element={<OculosDetail />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
