import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Main Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-700">JANSAHAY</span>
            </Link>
            {/* Desktop Main Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-700">Home</Link>
              <Link to="/report" className="text-gray-700 hover:text-blue-700">Report Issue</Link>
              <Link to="/history" className="text-gray-700 hover:text-blue-700">Issue History</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-700">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-700">Contact</Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-700">FAQ</Link>
            </div>
          </div>
          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-700">
              <FaSearch size={18} />
            </button>
            <button className="text-gray-600 hover:text-blue-700">
              <FaUserCircle size={22} />
            </button>
          </div>
          {/* Mobile Icons and menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="text-gray-600 hover:text-blue-700">
              <FaSearch size={18} />
            </button>
            <button className="text-gray-600 hover:text-blue-700">
              <FaUserCircle size={22} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-700"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-700">Home</Link>
              <Link to="/report" className="block px-3 py-2 text-gray-700 hover:text-blue-700">Report Issue</Link>
              <Link to="/history" className="block px-3 py-2 text-gray-700 hover:text-blue-700">Issue History</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-700">About</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-700">Contact</Link>
              <Link to="/faq" className="block px-3 py-2 text-gray-700 hover:text-blue-700">FAQ</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
