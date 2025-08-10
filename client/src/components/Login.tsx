import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const auth = getAuth(app);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in user:", userCredential.user);
            navigate('/');
        } catch (err: any) {
            console.error("Login error:", err);
            let errorMessage = "Login failed";

            // More user-friendly error messages
            if (err.code === "auth/user-not-found") {
                errorMessage = "No user found with this email";
            } else if (err.code === "auth/wrong-password") {
                errorMessage = "Incorrect password";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "Invalid email format";
            }

            setError(errorMessage);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err: any) {
            setError(err.message || "Google login failed");
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight text-center md:text-left">Welcome to CivicAtlas</h1>
                    <p className="text-gray-600 text-xs sm:text-sm mb-6 text-center md:text-left">
                        Your direct link to a better community. Report civic issues and track progress with ease.
                    </p>
                    {/* Google Sign-in */}
                    <button
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-100 font-medium"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-3 text-gray-400 text-xs">Or continue with email</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <form onSubmit={handleEmailLogin}>
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
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In With Email"}
                        </button>
                    </form>
                    {error && <div className="text-red-600 text-xs mt-3">{error}</div>}
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Don’t have an account?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            Sign up now.
                        </button>
                    </p>
                    <div className="mt-8 text-xs text-gray-400 text-center">
                        Privacy Policy &nbsp;|&nbsp; Terms of Service
                    </div>
                </div>
                {/* Right - Visual Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                        alt="Visual"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

