import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data.detail)) {
                    const msg = data.detail.map((err) => err.msg).join(", ");
                    throw new Error(msg);
                }
                throw new Error(data.detail || "Login failed");
            }

            login(data.access_token, data.user);
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Ambient Background matching Landing Page */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden flex justify-center items-center">
                <div className="absolute w-[60vw] h-[60vw] bg-white rounded-full blur-[250px] animate-aurora mix-blend-overlay opacity-5" />
                <div className="absolute w-[40vw] h-[40vw] top-[-10vw] right-[-10vw] bg-emerald-600/10 rounded-full blur-[200px] pointer-events-none" />
                <div className="absolute w-[50vw] h-[50vw] bottom-[-20vw] left-[-10vw] bg-blue-600/10 rounded-full blur-[200px] pointer-events-none" />
            </div>

            <div className="w-full max-w-md glass-panel glow-border p-10 md:p-14 relative z-10 overflow-hidden group">
                <div className="text-center mb-10 relative">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                        <Lock className="w-6 h-6 text-white/80" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Sign in to TruthLens</h1>
                    <p className="text-sm text-theme-muted font-medium">Enterprise Authentication</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-8 text-center font-medium backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-theme-muted mb-2 tracking-wider">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder-white/20"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-theme-muted mb-2 tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder-white/20"
                            placeholder="••••••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full h-14 mt-4 rounded-full bg-white text-black font-semibold text-sm transition-transform hover:scale-[1.02] flex items-center justify-center overflow-hidden disabled:opacity-70 disabled:hover:scale-100"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? 'Authenticating...' : <>Continue <ArrowRight size={16} /></>}
                        </span>
                        {!isLoading && <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-300 to-white opacity-0 hover:opacity-100 transition-opacity" />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-theme-muted">
                    Don't have an account? {' '}
                    <Link to="/signup" className="text-white hover:underline decoration-white/30 underline-offset-4 transition-all font-medium">
                        Request Access
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
