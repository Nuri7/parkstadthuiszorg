import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { HomePage } from './pages/HomePage';
import { DienstenPage } from './pages/DienstenPage';
import { OverOnsPage } from './pages/OverOnsPage';
import { VergoedingenPage } from './pages/VergoedingenPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { VoorwaardenPage } from './pages/VoorwaardenPage';
import { BlogPage } from './pages/BlogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HelmetProvider } from 'react-helmet-async';
import { ScrollToTop } from './components/utils/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <Router basename="/parkstadthuiszorg">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[var(--color-sage-500)] focus:text-white focus:rounded-xl focus:shadow-xl focus:text-lg focus:font-semibold"
      >
        Direct naar inhoud
      </a>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#02191c]">
        <Navbar />
        
        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diensten" element={<DienstenPage />} />
            <Route path="/over-ons" element={<OverOnsPage />} />
            <Route path="/vergoedingen" element={<VergoedingenPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/voorwaarden" element={<VoorwaardenPage />} />
            <Route path="/kennisbank" element={<BlogPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
        <FloatingContact />
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
