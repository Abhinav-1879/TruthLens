import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle,
    Navigation, Ban, Activity, Zap, TrendingUp, Lock
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const VISUALIZATION_STATES = {
    SYSTEM_ERROR: 'SYSTEM_ERROR',
    LOW_SIGNAL: 'LOW_SIGNAL',
    HIGH_RISK: 'HIGH_RISK',
    SAFE: 'SAFE'
};

const FAILURE_MODES = {
    FABRICATION: { color: '#f43f5e', label: 'Fabrication Detected', description: 'Model is generating unsubstantiated claims.' },
    SPECULATION: { color: '#f59e0b', label: 'Speculative Drift', description: 'Content exceeds known evidence boundaries.' },
    CONTRADICTION: { color: '#e11d48', label: 'Direct Contradiction', description: 'Claims actively conflict with verified facts.' },
    UNCERTAIN: { color: '#94a3b8', label: 'Uncertain Signal', description: 'Insufficient data to map risk trajectory.' },
    SAFE: { color: '#10b981', label: 'Verifiable Alignment', description: 'Content is aligned with verified sources.' }
};

/* -------------------------------------------------------------------------- */
/*                           MAIN COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const ConfidenceGraph = ({ claims, riskScore = 0 }) => {

    // -------------------------------------------------------------------------
    // 1. DATA DERIVATION
    // -------------------------------------------------------------------------
    const derivedIntegrity = useMemo(() => {
        if (!claims || claims.length === 0) return 0;
        const total = claims.reduce((acc, c) => {
            const val = c.status === 'verified' ? 100 : c.status === 'contradicted' ? -100 : 0;
            return acc + val;
        }, 0);
        return total / claims.length;
    }, [claims]);

    // -------------------------------------------------------------------------
    // 2. STRICT STATE DETERMINATION LOGIC
    // -------------------------------------------------------------------------
    const currentState = useMemo(() => {
        if (!claims || !Array.isArray(claims)) return VISUALIZATION_STATES.SYSTEM_ERROR;
        if (claims.length === 0) return VISUALIZATION_STATES.LOW_SIGNAL;

        const isCompromised = derivedIntegrity < 0;
        const isCriticalRisk = riskScore >= 70;

        if (isCompromised || isCriticalRisk) {
            return VISUALIZATION_STATES.HIGH_RISK;
        }

        return VISUALIZATION_STATES.SAFE;

    }, [claims, riskScore, derivedIntegrity]);

    // -------------------------------------------------------------------------
    // 3. RENDER ORCHESTRATION
    // -------------------------------------------------------------------------
    const renderContent = () => {
        switch (currentState) {
            case VISUALIZATION_STATES.SYSTEM_ERROR:
                return <ErrorStateDisplay />;
            case VISUALIZATION_STATES.LOW_SIGNAL:
                return <LowSignalDisplay />;
            case VISUALIZATION_STATES.HIGH_RISK:
            case VISUALIZATION_STATES.SAFE:
                return (
                    <RiskLandscape
                        claims={claims}
                        state={currentState}
                        integrityScore={derivedIntegrity}
                        riskScore={riskScore}
                    />
                );
            default:
                return <ErrorStateDisplay />;
        }
    };

    return (
        <div className="w-full h-full min-h-[380px] relative overflow-hidden glass-crazy rounded-3xl">
            {renderContent()}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                        SUB-COMPONENTS (LAYERS)                             */
/* -------------------------------------------------------------------------- */

const ErrorStateDisplay = () => (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 pattern-diagonal-lines opacity-20"></div>
        <Ban className="w-12 h-12 mb-4 text-rose-500/80" />
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">System Error</h3>
        <p className="text-xs text-gray-600 font-mono">Visualization Data Corrupt</p>
    </div>
);

const LowSignalDisplay = () => (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        <Activity className="w-10 h-10 mb-4 text-gray-600" />
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 z-10">Low Signal</h3>
        <p className="text-xs text-gray-600 z-10">No verifiable claims detected.</p>
    </div>
);

/* -------------------------------------------------------------------------- */
/*                     CORE VISUALIZATION: RISK LANDSCAPE                     */
/* -------------------------------------------------------------------------- */

const RiskLandscape = ({ claims, state, integrityScore, riskScore }) => {

    const totalConfidence = claims.reduce((acc, c) => acc + (c.confidence_score * 100), 0);
    const avgConfidence = claims.length > 0 ? totalConfidence / claims.length : 50;

    const xPos = Math.max(5, Math.min(95, avgConfidence));
    const yPos = Math.max(5, Math.min(95, ((integrityScore + 100) / 200) * 100));

    let activeMode = FAILURE_MODES.SAFE;
    if (state === VISUALIZATION_STATES.HIGH_RISK) {
        if (integrityScore <= -20) activeMode = FAILURE_MODES.CONTRADICTION;
        else if (avgConfidence < 40) activeMode = FAILURE_MODES.SPECULATION;
        else activeMode = FAILURE_MODES.FABRICATION;
    } else if (integrityScore < 20) {
        activeMode = FAILURE_MODES.UNCERTAIN;
    }

    const fieldRadius = Math.max(30, riskScore * 1.5);
    // Use slightly brighter colors for the dark mode if needed, but existing ones are okay

    // Calculate vector
    const deltaX = xPos - 50;
    const deltaY = yPos - 50;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const vectorLength = Math.min(60, Math.sqrt(deltaX * deltaX + deltaY * deltaY));

    return (
        <div className="w-full h-full min-h-[380px] relative flex flex-col justify-between">

            {/* CANVAS INTERACTIVE AREA */}
            <div className="absolute inset-0 overflow-hidden">

                {/* A. BACKGROUND GRID */}
                <div className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `linear-gradient(${activeMode.color} 1px, transparent 1px), linear-gradient(90deg, ${activeMode.color} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                {/* B. LAYER 1: RISK FIELD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1, left: `${xPos}%`, bottom: `${yPos}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute rounded-full blur-[80px] pointer-events-none transform -translate-x-1/2 translate-y-1/2"
                    style={{
                        width: `${fieldRadius * 5}px`,
                        height: `${fieldRadius * 5}px`,
                        backgroundColor: activeMode.color
                    }}
                />

                {/* C. FAILURE MODE ANIMATIONS */}
                {/* Fabrication: Cracks - lighter glow */}
                {activeMode === FAILURE_MODES.FABRICATION && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg width="100%" height="100%">
                            <pattern id="cracks" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path d="M10,10 L30,30 M50,10 L10,50" stroke={activeMode.color} strokeWidth="2" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#cracks)" />
                        </svg>
                    </div>
                )}

                {/* Contradiction: Pulse */}
                {activeMode === FAILURE_MODES.CONTRADICTION && (
                    <motion.div
                        animate={{ opacity: [0, 0.15, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 bg-rose-600/20 pointer-events-none"
                    />
                )}

                {/* D. LAYER 2: PRESSURE VECTOR */}
                <div className="absolute w-full h-full pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, left: `${xPos}%`, bottom: `${yPos}%` }}
                        transition={{ type: "spring", damping: 12 }}
                        className="absolute z-20"
                    >
                        {/* The Core Dot */}
                        <div className="relative -ml-2 -mb-2">
                            <div className="w-4 h-4 rounded-full border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.6)] bg-black z-30 relative"></div>

                            {/* The Pulse Ring */}
                            <div
                                className="absolute inset-0 -m-2 rounded-full opacity-60 animate-ping z-10"
                                style={{ backgroundColor: activeMode.color }}
                            ></div>

                            {/* The Vector Arrow */}
                            <div
                                className="absolute top-1/2 left-1/2 h-[2px] origin-left z-0"
                                style={{
                                    width: `${vectorLength * 4}px`,
                                    backgroundColor: activeMode.color,
                                    transform: `rotate(${-angle}deg)`,
                                    boxShadow: `0 0 15px ${activeMode.color}`
                                }}
                            >
                                <div className="absolute right-0 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-current transform rotate-45" style={{ color: activeMode.color }}></div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Axes Labels */}
                <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 font-mono tracking-widest">LOW INTEGRITY</div>
                <div className="absolute top-4 left-4 text-[10px] text-gray-500 font-mono tracking-widest">HIGH INTEGRITY</div>
                <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono tracking-widest text-right">HIGH CONFIDENCE</div>

            </div>

            {/* OVERLAY: VERDICT & GUIDANCE */}
            <div className="absolute top-0 left-0 w-full p-6 pointer-events-none z-30">
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            {state === 'HIGH_RISK' ? <AlertOctagon className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            <span
                                className="text-xs font-bold tracking-widest uppercase text-glow-primary"
                                style={{ color: activeMode.color }}
                            >
                                {state === 'HIGH_RISK' ? 'CRITICAL RISK DETECTED' : activeMode.label}
                            </span>
                        </div>
                        <h2 className="text-2xl font-light text-white tracking-tight drop-shadow-md">
                            {activeMode.description}
                        </h2>
                    </div>

                    <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs font-mono text-gray-300">
                            RISK_INDEX: {riskScore.toFixed(0)}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* LEGEND / STATUS BAR */}
            <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-black/40 backdrop-blur z-30">
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-fuchsia-400" />
                        <span>VECTOR_MAGNITUDE: {vectorLength.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 text-fuchsia-400" />
                        <span>TRAJECTORY: {angle.toFixed(0)}°</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfidenceGraph;
