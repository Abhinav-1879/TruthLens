import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black text-theme-main font-sans selection:bg-white/10 transition-colors duration-500 overflow-hidden relative">

            {/* VERY SUBTLE LIGHT DRIFT BACKGROUND (Hero Only) */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none z-0" />

            <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none z-0 overflow-hidden flex justify-center items-center mix-blend-screen">
                <div className="absolute w-[60vw] h-[60vw] top-[-10vw] left-[-20vw] bg-purple-600/30 rounded-full blur-[150px] animate-aurora" />
                <div className="absolute w-[70vw] h-[70vw] bottom-[-20vw] right-[-20vw] bg-emerald-600/20 rounded-full blur-[180px] animate-aurora" style={{ animationDelay: '2s', animationReverse: true }} />
                <div className="absolute w-[50vw] h-[50vw] top-[30%] left-[30%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            {/* ULTRA-PREMIUM FLOATING HEADER */}
            <nav className={`fixed w-full z-40 transition-all duration-700 top-0 pt-6 flex justify-center`}>
                <div className={`transition-all duration-500 rounded-full px-8 py-3 flex items-center justify-between gap-12 sm:gap-32 ${scrolled ? 'glass-panel shadow-2xl bg-black/50 border-white/10' : 'bg-transparent border-transparent'}`}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/80 rounded flex items-center justify-center relative overflow-hidden group glow-border">
                            <div className="w-1.5 h-1.5 bg-white rounded-sm group-hover:scale-150 transition-transform" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">TruthLens</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }} className="flex items-center gap-8">
                        <Link to="/audit" className="text-sm font-bold text-white/80 hover:text-emerald-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-emerald-400 after:transition-all">
                            Audit
                        </Link>
                        <Link to="/login" className="text-sm font-bold text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-white after:transition-all">
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* HERO SECTION - SECTION 1 */}
            <main className="relative z-10 pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen text-center">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="max-w-5xl mx-auto z-20 w-full relative pt-12">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] mb-8 relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <motion.span className="block animate-text-reveal" style={{ animationDelay: '0.1s' }}>REALITY IS</motion.span>
                        <motion.span className="block text-gradient-primary hover-glitch cursor-crosshair animate-text-reveal pt-2" style={{ animationDelay: '0.3s' }}>
                            FRAGILE.
                        </motion.span>
                    </h1>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="space-y-2 mb-16 max-w-2xl mx-auto relative z-10 bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                        <p className="text-xl md:text-2xl text-white font-medium leading-relaxed tracking-tight text-shadow">
                            AI systems fabricate with confidence.
                        </p>
                        <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                            TruthLens is the containment layer.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 flex-wrap">
                        <Link to="/dashboard" className="relative group w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-semibold text-sm transition-transform hover:scale-105 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                            <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">Enter Infrastructure</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link to="/audit" className="relative group w-full sm:w-auto h-14 px-8 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-bold text-sm flex items-center justify-center glow-border backdrop-blur-xl">
                            Launch Audit
                        </Link>
                        <Link to="/signup" className="relative group w-full sm:w-auto h-14 px-8 rounded-full bg-black/40 border border-white/20 text-white hover:border-white/50 transition-colors font-medium text-sm flex items-center justify-center glow-border backdrop-blur-xl">
                            Request Access
                        </Link>
                    </motion.div>
                </motion.div>
            </main>

            {/* DEPLOYMENT DOMAINS - BENTO GRID */}
            <section className="py-40 relative z-10 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="mb-20 text-center">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-white max-w-4xl mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Built for systems that <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400">cannot afford error.</span>
                        </h2>
                    </motion.div>

                    <div className="bento-grid">
                        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-10 glow-border flex flex-col justify-end min-h-[300px] relative overflow-hidden group bg-gradient-to-br from-black to-blue-900/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/40 rounded-full blur-[80px] group-hover:bg-blue-400/60 transition-all duration-500" />
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10 drop-shadow-md">Defense</h3>
                            <p className="text-blue-100/70 relative z-10 font-medium">Tactical AI verification for mission-critical operations.</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-10 glow-border flex flex-col justify-end min-h-[300px] relative overflow-hidden group md:col-span-2 bg-gradient-to-t from-emerald-900/20 to-black hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all">
                            <div className="absolute bottom-[-10%] left-0 w-full h-[80%] bg-emerald-500/30 blur-[100px] group-hover:bg-emerald-400/50 transition-all duration-500" />
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10 drop-shadow-md">Finance</h3>
                            <p className="text-emerald-100/70 max-w-md relative z-10 font-medium">Algorithmic trading and risk assessment hallucination containment.</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-10 glow-border flex flex-col justify-end min-h-[300px] relative overflow-hidden group md:col-span-2 bg-gradient-to-br from-black to-purple-900/20 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/40 rounded-full blur-[100px] group-hover:bg-purple-400/60 group-hover:scale-110 transition-all duration-500" />
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10 drop-shadow-md">Healthcare</h3>
                            <p className="text-purple-100/70 max-w-md relative z-10 font-medium">Securing diagnostic AI output from generative anomalies.</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-10 glow-border flex flex-col justify-end min-h-[300px] relative overflow-hidden group bg-gradient-to-tl from-black to-rose-900/20 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-all">
                            <div className="absolute top-0 left-0 w-48 h-48 bg-rose-500/40 rounded-full blur-[80px] group-hover:bg-rose-400/60 transition-all duration-500" />
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10 drop-shadow-md">Legal</h3>
                            <p className="text-rose-100/70 relative z-10 font-medium">Immutable citation verification and fact validation.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INFRASTRUCTURE - SECTION 3 */}
            <section className="py-40 relative z-10 border-t border-white/5 bg-black flex justify-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none z-0" />

                <div className="w-full max-w-7xl px-6 lg:px-12 relative z-10">
                    <div className="mb-20 text-center">
                        <span className="px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-8 inline-block backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)]">Secure Pipeline</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Zero-Trust Generation</h2>
                        <p className="text-xl text-blue-100/60 max-w-2xl mx-auto">TruthLens engine operates at wire speed, intercepting and scoring responses before they reach your users.</p>
                    </div>

                    <div className="glass-panel p-[1px] glow-border bg-gradient-to-b from-blue-900/20 to-black">
                        <div className="bg-black/80 rounded-2xl md:rounded-[1.4rem] p-8 md:p-20 relative overflow-hidden backdrop-blur-3xl z-10">
                            {/* Pipeline Flow */}
                            <div className="flex flex-col md:flex-row items-center justify-between relative z-10 w-full gap-12 md:gap-0">

                                <div className="glass-panel px-6 py-4 rounded-xl w-48 text-center text-white/90 font-bold border-white/20 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    Your LLM
                                </div>

                                <div className="hidden md:flex flex-1 items-center justify-center mx-4 relative h-10">
                                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-white/10 to-blue-500/30" />
                                    <div className="absolute w-1/2 h-[3px] bg-blue-400 blur-[3px] animate-flow-line" />
                                    <div className="absolute w-3 h-3 rounded-full bg-blue-300 shadow-[0_0_20px_#60a5fa,0_0_40px_#60a5fa] animate-flow-line" />
                                </div>

                                <div className="glass-panel px-10 py-8 rounded-2xl w-72 text-center font-black text-white border-blue-400/50 bg-blue-950/40 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.4),0_0_100px_rgba(59,130,246,0.2)] group hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-colors" />
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-scan blur-[1px]" style={{ animationDuration: '2s' }} />
                                    <div className="absolute w-full h-full top-0 left-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8),transparent_70%)] opacity-0 group-hover:opacity-40 transition-opacity blur-2xl" />
                                    <span className="relative z-10 text-xl tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">TruthLens Engine</span>
                                </div>

                                <div className="hidden md:flex flex-1 items-center justify-center mx-4 relative h-10">
                                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-blue-500/30 to-emerald-500/30" />
                                    <div className="absolute w-1/2 h-[3px] bg-emerald-400 blur-[3px] animate-flow-line" style={{ animationDelay: '1s' }} />
                                    <div className="absolute w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_20px_#34d399,0_0_40px_#34d399] animate-flow-line" style={{ animationDelay: '1s' }} />
                                </div>

                                <div className="glass-panel px-6 py-4 rounded-xl w-48 text-center text-emerald-300 font-bold border-emerald-400/40 bg-emerald-950/40 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                    Verified Safe
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUIET POWER - SECTION 4 */}
            <section className="py-48 relative z-10 border-t border-white/5 bg-black text-center overflow-hidden">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
                        <h2 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            BUILT FOR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 font-normal">REALITY.</span>
                        </h2>

                        <div className="mt-16 text-center">
                            <a href="#" className="inline-flex items-center justify-center h-16 px-10 rounded-full glass-panel border border-white/30 text-white hover:bg-white hover:text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-300 font-bold text-base tracking-wide">
                                Read Security Whitepaper
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MINIMAL FOOTER */}
            <footer className="py-12 border-t border-white/10 bg-black relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-theme-muted font-medium tracking-wide">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/20" /> TruthLens &copy; 2026</span>

                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                        <a href="#" className="hover:text-white transition-colors">Careers</a>
                        <a href="#" className="hover:text-white transition-colors">Press</a>
                        <a href="#" className="hover:text-white transition-colors">Responsible AI</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
