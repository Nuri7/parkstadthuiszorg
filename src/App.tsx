import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileStickyCTA } from './components/layout/MobileStickyCTA';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { DienstenPage } from './pages/DienstenPage';
import { OverOnsPage } from './pages/OverOnsPage';
import { VergoedingenPage } from './pages/VergoedingenPage';
import { ContactPage } from './pages/ContactPage';
import { HelmetProvider } from 'react-helmet-async';
import { ScrollToTop } from './components/utils/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a2420]">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diensten" element={<DienstenPage />} />
            <Route path="/over-ons" element={<OverOnsPage />} />
            <Route path="/vergoedingen" element={<VergoedingenPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        
        <Footer />
        <MobileStickyCTA />
        <WhatsAppButton />
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
