import React, { useState, useRef } from 'react';
import { Bot, Search, Activity, Download, Sparkles, ShieldCheck, AlertTriangle, Zap, Edit3, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText } from '../api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import InlineHighlighter from '../components/InlineHighlighter';
import HallucinationRisk from '../components/HallucinationRisk';
import IntegrityScore from '../components/IntegrityScore';
import ConfidenceMatrix from '../components/ConfidenceMatrix';
import ReasoningTrace from '../components/ReasoningTrace';

const Dashboard = () => {
    const [input, setInput] = useState('');
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const reportRef = useRef(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const data = await analyzeText(input, question);
            setResult(data);
        } catch (error) {
            console.error("Analysis Error:", error);
            const msg = error.response?.data?.detail || "Analysis failed. Please ensure backend is running.";
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`truthlens-report-${Date.now()}.pdf`);
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 font-sans tracking-wide">
            {/* Header Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                        <Bot className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            TruthLens
                        </h1>
                        <p className="text-sm text-gray-400 font-mono tracking-widest">NEBULA AUDIT PROTOCOL</p>
                    </div>
                </div>
                {result && (
                    <button
                        onClick={() => setResult(null)}
                        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        New Audit
                    </button>
                )}
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT COLUMN: Input & Source */}
                <div className="lg:col-span-5 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-crazy rounded-3xl p-1 relative overflow-hidden group"
                    >
                        {/* Clean Document Surface */}
                        <div className="bg-black/40 rounded-2xl p-6 md:p-8 min-h-[600px] flex flex-col backdrop-blur-sm">

                            <div className="flex justify-between items-center mb-6">
                                <label className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Source Stream
                                </label>
                                <div className="flex items-center gap-3">
                                    {result && (
                                        <button
                                            onClick={() => setResult(null)}
                                            className="text-xs text-gray-500 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
                                        >
                                            <Edit3 className="w-3 h-3" /> Edit
                                        </button>
                                    )}
                                    {result && <span className="text-xs text-emerald-400 flex items-center font-bold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]"><Sparkles className="w-3 h-3 mr-1" /> AUDITED</span>}
                                </div>
                            </div>

                            <div className="flex-grow relative group/input">
                                {result ? (
                                    <InlineHighlighter text={input} claims={result.claims} />
                                ) : (
                                    <div className="relative h-full flex flex-col">
                                        {!input && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 pointer-events-none">
                                                <div className="text-center space-y-6 pointer-events-auto max-w-lg">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                                                        <Bot className="w-10 h-10 text-fuchsia-400" />
                                                    </div>

                                                    <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                                                        Deep Audit
                                                    </h2>

                                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                                        <span>Inject text for confidence scoring & hallucination detection.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className={`
                                                w-full h-full min-h-[400px] bg-transparent border-none text-gray-200 placeholder-gray-700/50 focus:placeholder-gray-700/20 focus:outline-none focus:ring-0 resize-none font-mono text-sm leading-7 relative z-20 transition-all selection:bg-fuchsia-500/50
                                                ${!input ? 'bg-transparent' : ''}
                                            `}
                                            placeholder="// Awaiting input stream..."
                                        />
                                        <div className="text-right text-xs text-gray-600 font-mono mt-2 relative z-20">
                                            {input.length} chars
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Audit Question Layer */}
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                                    Focus Parameters (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    maxLength={200}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono"
                                    placeholder='e.g. "Verify statistical claims"'
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !input.trim()}
                                    className={`
                                        relative overflow-hidden group/btn bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-8 py-3 rounded-xl font-bold tracking-wide flex items-center space-x-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]
                                        ${isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                                    `}
                                >
                                    {isLoading ? (
                                        <>
                                            <Activity className="animate-spin w-4 h-4" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Initiate Audit</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <ReasoningTrace result={result} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: Analytics Dashboard */}
                <div className="lg:col-span-7 space-y-6" ref={reportRef}>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ staggerChildren: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Top Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Trust Score Card */}
                                    <div className="glass-crazy p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                                        <div className="absolute top-4 left-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-fuchsia-500" /> System Integrity
                                        </div>
                                        <IntegrityScore score={result.overall_trust_score} />
                                    </div>

                                    {/* Hallucination Risk */}
                                    <div className="min-h-[280px]">
                                        <HallucinationRisk
                                            riskLevel={result.hallucination_risk_level}
                                            score={result.risk_score}
                                            breakdown={result.score_breakdown}
                                            confidenceInterval={result.confidence_interval}
                                        />
                                    </div>
                                </div>

                                {/* Graphs Row */}
                                <div className="glass-crazy p-6 rounded-3xl border border-white/10 min-h-[400px]">
                                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                        <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
                                            Confidence vs. Evidence Matrix
                                        </h3>
                                    </div>
                                    <ConfidenceMatrix claims={result.claims} />
                                </div>

                                {result.question && (
                                    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 backdrop-blur-sm">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                                            <Search className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest block mb-0.5">AUDIT FOCUS</span>
                                            <p className="text-sm text-cyan-100 font-medium">"{result.question}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* MANDATORY VERDICT STRIP */}
                                <div className={`p-6 rounded-2xl border-l-4 font-bold text-xl tracking-tight flex items-center gap-4 backdrop-blur-md shadow-2xl ${result.risk_score > 85 ? 'bg-rose-950/40 border-rose-500 text-rose-500 shadow-rose-900/20' :
                                    result.risk_score > 60 ? 'bg-amber-950/40 border-amber-500 text-amber-500 shadow-amber-900/20' :
                                        'bg-emerald-950/40 border-emerald-500 text-emerald-500 shadow-emerald-900/20'
                                    }`}>
                                    {result.risk_score > 85 ? (
                                        <>
                                            <AlertTriangle className="w-8 h-8" />
                                            <span>❌ CRITICAL RISK — DO NOT SHIP</span>
                                        </>
                                    ) : result.risk_score > 60 ? (
                                        <>
                                            <AlertTriangle className="w-8 h-8" />
                                            <span>⚠️ HIGH RISK — REVIEW REQUIRED</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-8 h-8" />
                                            <span>✅ SAFE — EVIDENCE SUPPORTS CLAIMS</span>
                                        </>
                                    )}
                                </div>

                                {/* Detailed Claims List */}
                                <div className="glass-crazy rounded-3xl overflow-hidden flex flex-col border border-white/5">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                                        <h3 className="font-bold text-gray-300 text-sm tracking-wide flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-fuchsia-500" /> VERDICT LOG
                                        </h3>
                                        <button
                                            onClick={handleExport}
                                            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors flex items-center space-x-2 border border-white/10"
                                        >
                                            <Download className="w-3 h-3" /> <span>Export Report</span>
                                        </button>
                                    </div>
                                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-0">
                                        {result.claims.map((claim, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className="p-6 border-b border-white/5 hover:bg-white/5 transition-colors group flex gap-4"
                                            >
                                                <div className="mt-1">
                                                    <div className={`
                                                        w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-black
                                                        ${claim.status === 'verified' ? 'bg-emerald-500 ring-emerald-500/20 shadow-[0_0_10px_#10b981]' :
                                                            claim.status === 'contradicted' ? 'bg-rose-500 ring-rose-500/20 shadow-[0_0_10px_#ef4444]' : 'bg-amber-500 ring-amber-500/20 shadow-[0_0_10px_#f59e0b]'}
                                                    `} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <p className="text-sm text-gray-200 leading-relaxed font-normal">
                                                        "{claim.atomic_fact}"
                                                    </p>
                                                    {claim.explanation && (
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            <span className="text-fuchsia-400/70 font-semibold tracking-wide">ANALYSIS:</span> {claim.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right pl-4">
                                                    <span className="text-[10px] text-gray-600 font-bold tracking-widest block mb-1">CONFIDENCE</span>
                                                    <span className="text-sm font-mono text-gray-400">{(claim.confidence_score * 100).toFixed(0)}%</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center min-h-[500px] border border-dashed border-white/10 rounded-3xl bg-white/5"
                            >
                                <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                    <Bot className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">Ready to Audit</h3>
                                <p className="text-sm text-gray-600 text-center max-w-xs">
                                    Awaiting input for analysis...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
