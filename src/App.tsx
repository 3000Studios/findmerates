import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Rates from "./pages/Rates";
import Calculators from "./pages/Calculators";
import Pro from "./pages/Pro";
import Guide from "./pages/Guide";
import Dashboard from "./pages/Dashboard";
import Legal from "./pages/Legal";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import CategoryPage from "./pages/CategoryPage";
import ProGuide from "./pages/ProGuide";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";
import GeminiChat from "./components/GeminiChat";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
return (
  <ErrorBoundary>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rates/:categoryId" element={<CategoryPage />} />
          <Route path="/rates/search" element={<Rates />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/:type" element={<Calculators />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/pro-guide" element={<ProGuide />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/:type" element={<Legal />} />
        </Routes>
        <GeminiChat />
      </Layout>
    </Router>
  </ErrorBoundary>
);
}
