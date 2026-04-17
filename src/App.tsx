import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
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
      <Router basename="/parkstadthuiszorg">
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#02191c]">
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
        <FloatingContact />
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
