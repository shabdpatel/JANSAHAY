import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white border-t mt-10">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* About */}
      <div>
        <span className="font-bold text-blue-700 text-xl">JANSAHAY</span>
        <p className="text-sm text-gray-600 mt-3">
          Civic Reporter empowers citizens to report, track, and resolve local issues, making neighborhoods safer and cleaner. Join us in building a better community!
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
          <li><Link to="/report" className="text-gray-600 hover:text-blue-700">Report Issue</Link></li>
          <li><Link to="/history" className="text-gray-600 hover:text-blue-700">Issue History</Link></li>
          <li><Link to="/about" className="text-gray-600 hover:text-blue-700">About</Link></li>
          <li><Link to="/contact" className="text-gray-600 hover:text-blue-700">Contact</Link></li>
          <li><Link to="/faq" className="text-gray-600 hover:text-blue-700">FAQ</Link></li>
          <li><Link to="/privacy" className="text-gray-600 hover:text-blue-700">Privacy Policy</Link></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Contact Us</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" /> 123 Civic Lane, Cityville, IN 12345
          </li>
          <li className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" /> support@jansahay.com
          </li>
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-600" /> +1 (555) 123-4567
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
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
    <div className="border-t text-xs text-gray-500 py-4 text-center bg-gray-50">
      &copy; {new Date().getFullYear()} Civic Reporter &mdash; All rights reserved.
    </div>
  </footer>
);

export default Footer;
