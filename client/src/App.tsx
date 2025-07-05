import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Footer from './components/Footer';
import IssueDetails from './pages/IssueDetails';
import ReportIssue from './pages/Reportissue';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import Issues from './pages/Issues';
import IssueMap from './pages/Issuemap';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import Contact from './pages/Contact';
import FAQ from './pages/Faq';

// Scroll restoration component
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const cld = new Cloudinary({ cloud: { cloudName: 'dqrbhkqrb' } });
  const img = cld
    .image('cld-sample-5')
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500));

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ScrollToTopOnRouteChange />
        <Navbar />
        <main className="pt-16 flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issuemap" element={<IssueMap />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;