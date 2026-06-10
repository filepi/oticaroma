import { useEffect } from 'react';
import Hero from '../components/Hero';
import OfertasCarousel from '../components/OfertasCarousel';
import ClubeForm from '../components/ClubeForm';
import FaleConosco from '../components/FaleConosco';

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <>
      <Hero />
      <OfertasCarousel />
      <ClubeForm />
      <FaleConosco />
    </>
  );
}
