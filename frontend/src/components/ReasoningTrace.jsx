import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, CheckCircle, FileText, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

const TraceStep = ({ icon: Icon, title, description, isActive, isCompleted, delay, index, total }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay }}
            className="relative pl-8 pb-8 last:pb-0"
        >
            {/* Connecting Line */}
            {index !== total - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-slate-800">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 0.5, delay: delay + 0.2 }}
                        className="w-full bg-cyan-900/50"
                    />
                </div>
            )}

            {/* Icon Node */}
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-slate-950 transition-colors duration-500 ${isActive ? 'border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                    isCompleted ? 'border-emerald-500 text-emerald-500' : 'border-slate-700 text-slate-700'
                }`}>
                <Icon className="w-3 h-3" />
            </div>

            {/* Content */}
            <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                <h4 className={`text-sm font-bold tracking-wide ${isActive ? 'text-cyan-300' :
                        isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                    {title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-mono">{description}</p>
            </div>
        </motion.div>
    );
}

const ReasoningTrace = ({ isLoading, result }) => {
    const [isOpen, setIsOpen] = useState(true);

    const steps = [
        { icon: FileText, title: "CLAIM EXTRACTION", desc: "Decomposing text into atomic verifiable facts." },
        { icon: Search, title: "EVIDENCE RETRIEVAL", desc: "Searching Trusted Web Corpus (Google/DuckDuckGo)." },
        { icon: Brain, title: "NLI VERIFICATION", desc: "Cross-referencing claims against evidence using Gemma 27B." },
        { icon: CheckCircle, title: "RISK ASSESSMENT", desc: "Calculating final integrity score and hallucination probability." }
    ];

    return (
        <div className="glass-panel border-l-4 border-l-cyan-500 rounded-r-xl rounded-l-none overflow-hidden mt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
            >
                <div className="flex items-center space-x-3">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-slate-200 tracking-wider group-hover:text-cyan-300 transition-colors">
                        NEURAL AUDIT LOG
                    </span>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-2">
                            {steps.map((step, idx) => (
                                <TraceStep
                                    key={idx}
                                    index={idx}
                                    total={steps.length}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.desc}
                                    isActive={false} // In a real app, bind to loading state
                                    isCompleted={true}
                                    delay={idx * 0.15}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReasoningTrace;
