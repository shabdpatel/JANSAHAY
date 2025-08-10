import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Scroll to top component
export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

const Footer = () => (
  <footer className="bg-white border-t mt-10">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* About */}
      <div>
        <span className="font-bold text-blue-700 text-xl">CivicAtlas</span>
        <p className="text-sm text-gray-600 mt-3">
          Empowering citizens to report, track, and resolve local issues, making neighborhoods safer and cleaner. Join us in building a better community!
        </p>
        <div className="flex gap-3 mt-4">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
            <FaGithub size={20} />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
            <FaTwitter size={20} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="text-gray-600 hover:text-blue-700">Home</Link></li>
          <li><Link to="/report-issue" className="text-gray-600 hover:text-blue-700">Report Issue</Link></li>
          <li><Link to="/issues" className="text-gray-600 hover:text-blue-700">Issue History</Link></li>
          <li><Link to="/issuemap" className="text-gray-600 hover:text-blue-700">Issue Map</Link></li>
          <li><Link to="/contact" className="text-gray-600 hover:text-blue-700">Contact</Link></li>
          <li><Link to="/faq" className="text-gray-600 hover:text-blue-700">FAQ</Link></li>
          <li><Link to="/login" className="text-gray-600 hover:text-blue-700">Login</Link></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Contact Us</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" /> Bhabua, Kaimur, Bihar 821101
          </li>
          <li className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" /> shabdpatel87@gmail.com
          </li>
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-600" /> +91 8757489128
          </li>
        </ul>
      </div>
      {/* Newsletter Signup */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Stay Updated</h4>
        <p className="text-sm text-gray-600 mb-3">Subscribe to our newsletter for the latest updates and community stories.</p>
        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 flex-grow"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
    <div className="border-t text-xs text-gray-500 py-4 text-center bg-gray-50">
      &copy; {new Date().getFullYear()} Jan Sahay &mdash; All rights reserved. |
      <Link to="/privacy" className="ml-1 hover:text-blue-700">Privacy Policy</Link> |
      <Link to="/terms" className="ml-1 hover:text-blue-700">Terms of Service</Link>
    </div>
    <ScrollToTop />
  </footer>
);

export default Footer;