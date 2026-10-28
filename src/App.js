import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, CTABand, NotFound, QuoteProvider, RouteEffects } from './Components/layout/SiteLayout';
import ContactSection from './Components/sections/ContactSection';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import useDocumentMeta from './hooks/useDocumentMeta';
function Site() {
  useDocumentMeta();
  return <QuoteProvider>
  <RouteEffects />
  <div id="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutUs" element={<AboutPage />} />
        <Route path="/Services" element={<ServicesPage />} />
        <Route path="/Products" element={<ProductsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CTABand />
      <ContactSection />
    </main>
    <Footer />
  </div>
  </QuoteProvider>;
}
export default function App() {
  return <BrowserRouter future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }}>
  <Site />
  </BrowserRouter>;
}
