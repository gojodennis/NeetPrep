import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/app');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4 font-sans">
            <Link to="/" className="absolute top-6 left-6 text-earth-700 hover:text-earth-900 flex items-center font-medium transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
            </Link>

            <div className="card-premium w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-earth-900">Welcome Back</h2>
                    <p className="text-earth-600 mt-2">Sign in to continue your prep journey</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-earth-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-earth-200 focus:border-earth-700 focus:outline-none focus:ring-0 transition-colors bg-earth-50/50 text-earth-900 placeholder:text-earth-400 font-medium"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-earth-700">Password</label>
                            <a href="#" className="text-sm font-medium text-earth-600 hover:text-earth-800 hover:underline">Forgot?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-earth-200 focus:border-earth-700 focus:outline-none focus:ring-0 transition-colors bg-earth-50/50 text-earth-900 placeholder:text-earth-400 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg justify-center mt-2 group"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-earth-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-earth-800 font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
