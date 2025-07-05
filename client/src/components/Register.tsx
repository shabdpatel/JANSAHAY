import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const auth = getAuth(app);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (auth.currentUser && name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
        setLoading(false);
    };

    const handleGoogleRegister = async () => {
        setError(null);
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err: any) {
            setError(err.message || "Google registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-2 py-4 sm:px-4 sm:py-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-md sm:max-w-lg md:max-w-5xl mx-auto">
                {/* Left - Auth Section */}
                <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-10 flex flex-col justify-center">
                    {/* Logo */}
                    <div className="mb-6 flex justify-center md:justify-start">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" alt="Logo" className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight text-center md:text-left">Create Your JANSAHAY Account</h1>
                    <p className="text-gray-600 text-xs sm:text-sm mb-6 text-center md:text-left">
                        Join JANSAHAY to help improve your community.
                    </p>
                    {/* Google Register */}
                    <button
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-100 font-medium mb-4"
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.972 32.082 29.418 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.813.857 6.661 2.278l6.366-6.366C33.527 6.532 28.977 4.5 24 4.5 12.954 4.5 4 13.454 4 24.5s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z" /><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.084 19.01 13 24 13c2.507 0 4.813.857 6.661 2.278l6.366-6.366C33.527 6.532 28.977 4.5 24 4.5c-7.732 0-14.313 4.388-17.694 10.191z" /><path fill="#FBBC05" d="M24 44.5c5.418 0 9.972-2.918 12.303-7.083l-11.303-8h-8v5.5C14.655 39.916 19.01 43 24 43z" /><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.872 32.082 29.418 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.813.857 6.661 2.278l6.366-6.366C33.527 6.532 28.977 4.5 24 4.5c-7.732 0-14.313 4.388-17.694 10.191l6.571 4.819C14.655 16.084 19.01 13 24 13c2.507 0 4.813.857 6.661 2.278l6.366-6.366C33.527 6.532 28.977 4.5 24 4.5c-7.732 0-14.313 4.388-17.694 10.191z" /></g></svg>
                        Register with Google
                    </button>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border border-gray-300 p-2 rounded-md mb-3 text-sm"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="your.email@example.com"
                            className="w-full border border-gray-300 p-2 rounded-md mb-3 text-sm"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border border-gray-300 p-2 rounded-md mb-4 text-sm"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium mb-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                    {error && <div className="text-red-600 text-xs mt-3">{error}</div>}
                    <button
                        className="w-full border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-100 font-medium"
                        type="button"
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Sign in
                    </button>
                    <div className="mt-8 text-xs text-gray-400 text-center">
                        Privacy Policy &nbsp;|&nbsp; Terms of Service
                    </div>
                </div>
                {/* Right - Visual Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                        alt="Visual"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

