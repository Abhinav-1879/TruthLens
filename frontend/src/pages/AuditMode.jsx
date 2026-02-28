import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Bot, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditMode = () => {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditResult, setAuditResult] = useState(null);
    const [chatResponse, setChatResponse] = useState(null);
    const [isAsking, setIsAsking] = useState(false);
    const navigate = useNavigate();

    const handleAsk = async () => {
        setIsAsking(true);
        setAuditResult(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/v1/chat/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            setChatResponse(data.answer);
        } catch (error) {
            console.error("Ask failed", error);
        } finally {
            setIsAsking(false);
        }
    };

    const handleAudit = async () => {
        setIsAnalyzing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/v1/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            setAuditResult(data);
        } catch (error) {
            console.error("Audit failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen p-8 font-sans selection:bg-color-plasma/20 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-color-plasma/5 rounded-full blur-[120px] animate-drift-slow" />
            </div>

            <header className="mb-12 flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <Shield className="text-color-plasma w-6 h-6" />
                        </div>
                        PRE-FLIGHT AUDIT
                    </h1>
                    <p className="text-slate-500 mt-2 font-mono text-xs tracking-widest uppercase">Safety Verification Protocol</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors px-6 py-3 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO CONSOLE
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Input Section */}
                <section>
                    <label className="block text-xs font-bold text-color-plasma uppercase tracking-widest mb-4">Content Injection</label>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-color-plasma/20 to-color-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <textarea
                            className="relative w-full h-[500px] bg-black/40 border border-white/10 rounded-2xl p-8 text-slate-200 focus:outline-none focus:border-color-plasma/50 focus:ring-0 transition-all resize-none font-mono text-sm leading-8 backdrop-blur-xl"
                            placeholder="// Paste LLM output or prompts for verification..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            onClick={handleAsk}
                            disabled={!text || isAnalyzing || isAsking}
                            className={`px-8 py-4 rounded-xl font-bold tracking-wide transition-all border border-white/10 ${isAsking
                                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                : 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/30'
                                }`}
                        >
                            {isAsking ? <span className="animate-pulse">QUERYING...</span> : 'TEST PROMPT'}
                        </button>
                        <button
                            onClick={handleAudit}
                            disabled={!text || isAnalyzing}
                            className={`px-10 py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg ${isAnalyzing
                                ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-105 hover:shadow-color-plasma/20'
                                }`}
                        >
                            {isAnalyzing ? <span className="animate-pulse">SCANNING REALITY...</span> : 'INITIATE AUDIT'}
                        </button>
                    </div>
                </section>

                {/* Results Section */}
                <section className="relative min-h-[600px]">
                    {!auditResult && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                            <Activity size={48} className="mb-6 opacity-20" />
                            <p className="font-mono text-sm tracking-widest">AWAITING INPUT STREAM</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center border border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm">
                            <div className="w-20 h-20 border-4 border-color-plasma border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(217,70,239,0.2)]"></div>
                            <p className="text-color-plasma font-mono animate-pulse tracking-widest text-sm">ANALYZING INTEGRITY FIELDS...</p>
                        </div>
                    )}

                    {chatResponse && !auditResult && !isAnalyzing && !isAsking && (
                        <div className="anti-gravity-card p-8 rounded-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-color-plasma/10 text-color-plasma p-2 rounded-lg border border-color-plasma/20">
                                    <Bot size={24} />
                                </span>
                                <h2 className="text-xl font-bold text-white">Model Response</h2>
                            </div>
                            <p className="text-slate-300 leading-8 text-lg font-light">{chatResponse}</p>
                        </div>
                    )}

                    {auditResult && (
                        <AuditDecisionCard result={auditResult} />
                    )}
                </section>
            </main>
        </div>
    );
};

const AuditDecisionCard = ({ result }) => {
    const decision = result.executive_brief?.action_recommendation || (result.hallucination_score > 60 ? "REJECT" : result.hallucination_score > 35 ? "HOLD" : "SHIP");

    const statusConfig = {
        "SHIP": { color: "bg-emerald-500", text: "text-emerald-500", icon: <CheckCircle size={48} />, label: "INTEGRITY STABLE" },
        "HOLD": { color: "bg-amber-500", text: "text-amber-500", icon: <AlertTriangle size={48} />, label: "UNSTABLE DETECTED" },
        "REJECT": { color: "bg-rose-600", text: "text-rose-500", icon: <XCircle size={48} />, label: "CRITICAL FAILURE" }
    };

    const config = statusConfig[decision] || statusConfig["HOLD"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] overflow-hidden anti-gravity-card bg-black/40"
        >
            {/* Header: The Verdict */}
            <div className={`p-10 flex items-center justify-between relative overflow-hidden group`}>
                <div className={`absolute inset-0 opacity-10 ${config.color}`} />
                <div className="relative z-10">
                    <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${config.text}`}>{config.label}</p>
                    <h2 className="text-6xl font-black tracking-tighter text-white drop-shadow-lg">{decision}</h2>
                </div>
                <div className={`relative z-10 ${config.text} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                    {config.icon}
                </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
                {result.executive_brief && (
                    <div className="border-l-2 border-white/10 pl-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Executive Summary</h3>
                        <p className="text-xl text-white font-light leading-relaxed">
                            "{result.executive_brief.business_impact}"
                        </p>
                    </div>
                )}

                {/* SCORING MATRIX */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ScoreBox label="Integrity" value={`${result.integrity_score}%`} sub="Honesty" color="text-emerald-400" />
                    <ScoreBox label="Hallucination" value={`${result.hallucination_score}%`} sub="Risk Probability" color={result.hallucination_score > 50 ? 'text-rose-500 animate-pulse' : 'text-amber-500'} />
                    <ScoreBox label="Conf. Gap" value={`${result.confidence_gap}%`} sub="Overconfidence" color="text-blue-400" />
                </div>

                {/* Fingerprints */}
                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Fingerprints</h3>
                    <div className="space-y-3">
                        {result.claims.filter(c => c.fingerprint && c.fingerprint.type !== 'none').slice(0, 3).map((claim, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase mt-0.5 border ${claim.fingerprint.impact_level === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                    {claim.fingerprint.type}
                                </span>
                                <div>
                                    <p className="text-slate-300 text-sm mb-1 line-clamp-2 font-mono">"{claim.original_text}"</p>
                                    <p className="text-slate-500 text-xs">{claim.fingerprint.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ScoreBox = ({ label, value, sub, color }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">{label}</p>
        <p className={`text-3xl font-mono font-bold ${color}`}>{value}</p>
        <p className="text-[10px] text-slate-600 mt-2 lowercase">{sub}</p>
    </div>
);

export default AuditMode;
