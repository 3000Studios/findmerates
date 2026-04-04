import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rates from './pages/Rates';
import Calculators from './pages/Calculators';
import Pro from './pages/Pro';
import Guide from './pages/Guide';
import Dashboard from './pages/Dashboard';
import Legal from './pages/Legal';
import News from './pages/News';
import GeminiChat from './components/GeminiChat';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rates/:category" element={<Rates />} />
            <Route path="/rates/search" element={<Rates />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/:type" element={<Calculators />} />
            <Route path="/pro" element={<Pro />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/:type" element={<Legal />} />
          </Routes>
          <GeminiChat />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
