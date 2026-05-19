import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import GeminiChat from "./components/GeminiChat";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Rates = lazy(() => import("./pages/Rates"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Pro = lazy(() => import("./pages/Pro"));
const Guide = lazy(() => import("./pages/Guide"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Legal = lazy(() => import("./pages/Legal"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProGuide = lazy(() => import("./pages/ProGuide"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const OpsDashboard = lazy(() => import("./pages/OpsDashboard"));
const Signup = lazy(() => import("./pages/Signup"));
const CategoryCityPage = lazy(() => import("./pages/CategoryCityPage"));
const HowWeMakeMoney = lazy(() => import("./pages/HowWeMakeMoney"));
const AffiliateDisclosure = lazy(() => import("./pages/AffiliateDisclosure"));
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy"));
const Methodology = lazy(() => import("./pages/Methodology"));

const LoadingSpinner = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rates/:categoryId" element={<CategoryPage />} />
              <Route path="/rates/:category/in/:city" element={<CategoryCityPage />} />
              <Route path="/rates/search" element={<Rates />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculators/:type" element={<Calculators />} />
              <Route path="/pro" element={<Pro />} />
              <Route path="/pro-guide" element={<ProGuide />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:slug" element={<StoryDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/how-we-make-money" element={<HowWeMakeMoney />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
              <Route path="/editorial-policy" element={<EditorialPolicy />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/ops" element={<OpsDashboard />} />
              <Route path="/:type" element={<Legal />} />
            </Routes>
          </Suspense>
          <GeminiChat />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
