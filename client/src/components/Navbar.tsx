import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from '../firebase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/issues', label: 'All Issues' },
    { to: '/report-issue', label: 'Report Issue' },
    { to: '/history', label: 'Issue History' },
    { to: '/issuemap', label: 'Issue Map' }, // <-- Changed from About to Issue Map
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleMobileLinkClick = () => setIsOpen(false);

  const handleLogin = () => {
    setUserMenuOpen(false);
    navigate('/login');
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const auth = getAuth(app);
    await signOut(auth);
    navigate('/');
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUserName(user?.displayName || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Main Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center" aria-label="Home">
              <span className="text-xl font-bold text-blue-700">JANSAHAY</span>
            </Link>
            {/* Desktop Main Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-700 hover:text-blue-700 transition-colors ${isActive(link.to) ? 'font-bold text-blue-700 underline underline-offset-4' : ''}`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-700" aria-label="Search">
              <FaSearch size={18} />
            </button>
            <div className="relative">
              <button
                className="text-gray-600 hover:text-blue-700"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen(v => !v)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
              >
                <FaUserCircle size={22} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                  {isLoggedIn && (
                    <div className="px-4 py-2 text-gray-700 font-semibold flex items-center gap-2">
                      <FaUser className="mr-1" /> {userName || "Profile"}
                    </div>
                  )}
                  {isLoggedIn ? (
                    <button
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onMouseDown={handleLogout}
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  ) : (
                    <button
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onMouseDown={handleLogin}
                    >
                      <FaSignOutAlt className="mr-2" /> Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Mobile Icons and menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="text-gray-600 hover:text-blue-700" aria-label="Search">
              <FaSearch size={18} />
            </button>
            <button
              className="text-gray-600 hover:text-blue-700"
              aria-label="User menu"
              onClick={() => setUserMenuOpen(v => !v)}
            >
              <FaUserCircle size={22} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-700"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile User Dropdown */}
        {userMenuOpen && (
          <div className="md:hidden absolute right-4 top-16 w-44 bg-white border rounded shadow-lg z-50">
            {isLoggedIn && (
              <div className="px-4 py-2 text-gray-700 font-semibold flex items-center gap-2">
                <FaUser className="mr-1" /> {userName || "Profile"}
              </div>
            )}
            {isLoggedIn ? (
              <button
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                onMouseDown={handleLogout}
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            ) : (
              <button
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                onMouseDown={handleLogin}
              >
                <FaSignOutAlt className="mr-2" /> Login
              </button>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-700 transition-colors ${isActive(link.to) ? 'font-bold text-blue-700 underline underline-offset-4' : ''}`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                  onClick={handleMobileLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
