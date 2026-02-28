import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HallucinationRisk = ({ riskLevel, score, breakdown, confidenceInterval }) => {
    // -------------------------------------------------------------------------
    // STRICT SCREENSHOT MATCH: CRITICAL RISK CARD
    // -------------------------------------------------------------------------

    const isCritical = score > 60;
    const isMedium = score > 30 && score <= 60;

    let primaryColor = '#ef4444'; // Red-500
    let labelText = 'CRITICAL RISK';
    let iconColor = 'text-red-500';
    let labelColor = 'text-red-500';
    let glowColor = 'rgba(239, 68, 68, 0.5)';

    if (!isCritical) {
        if (isMedium) {
            primaryColor = '#f59e0b'; // Amber
            labelText = 'POSSIBLE RISK';
            iconColor = 'text-amber-500';
            labelColor = 'text-amber-500';
            glowColor = 'rgba(245, 158, 11, 0.5)';
        } else {
            primaryColor = '#10b981'; // Emerald
            labelText = 'NO RISK DETECTED';
            iconColor = 'text-emerald-500';
            labelColor = 'text-emerald-500';
            glowColor = 'rgba(16, 185, 129, 0.5)';
        }
    }

    const segments = 22;

    // Breakdown Stats
    const breakdownItems = [
        { label: 'Evidence Coverage', value: breakdown?.evidence_coverage || 0, color: 'text-cyan-400', barInfo: 'bg-cyan-400' },
        { label: 'Claim Verifiability', value: breakdown?.claim_verifiability || 0, color: 'text-fuchsia-400', barInfo: 'bg-fuchsia-400' },
        { label: 'Confidence Gap', value: breakdown?.confidence_evidence_gap || 0, color: 'text-violet-400', barInfo: 'bg-violet-400' }
    ];

    return (
        <div className="relative w-full h-full min-h-[280px] glass-crazy rounded-2xl p-6 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">

            {/* Ambient Glow based on risk */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-transparent to-current opacity-10 blur-3xl pointer-events-none" style={{ color: primaryColor }} />

            {/* Background ECG Line (Faint Pulse) */}
            <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
                <svg viewBox="0 0 400 100" className="w-full h-48 stroke-current" fill="none" style={{ color: primaryColor }}>
                    <path d="M0 50 H150 L170 10 L190 90 L210 50 H400" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>

            {/* Top Row: Header & Score */}
            <div className="flex justify-between items-start relative z-10 text-white mb-6">
                <div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                        HALLUCINATION RISK
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Warning Icon (Circled Exclamation) */}
                        <div className={`rounded-full border-2 ${isCritical ? 'border-red-500' : isMedium ? 'border-amber-500' : 'border-emerald-500'} w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[0_0_15px_${glowColor}]`}>
                            <span className={`text-sm font-bold ${labelColor} font-mono block translate-y-[1px]`}>!</span>
                        </div>
                        <div>
                            <span className={`text-xl font-black tracking-tight ${labelColor} drop-shadow-[0_0_10px_${glowColor}] block leading-none`}>
                                {labelText}
                            </span>
                            {/* Confidence Band Display */}
                            {confidenceInterval && (
                                <span className="text-[10px] text-gray-400 font-mono tracking-wide mt-1 block">
                                    CONFIDENCE: {confidenceInterval[0]}% - {confidenceInterval[1]}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Large Percentage */}
                <div className={`text-6xl font-black tracking-tight ${labelColor} drop-shadow-[0_0_15px_${glowColor}]`}>
                    {score}%
                </div>
            </div>

            {/* Middle Row: Audit Trail (Breakdown) */}
            <div className="relative z-10 mb-6 border-t border-white/10 pt-4">
                <div className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-3 flex justify-between items-center">
                    <span>AUDIT LOGIC TRAIL</span>
                    <span className="text-gray-600">v2.1</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {breakdownItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">{item.label}</span>
                            <div className="flex items-end gap-2">
                                <span className={`text-lg font-bold font-mono ${item.color}`}>{item.value}%</span>
                                <div className="h-1.5 flex-1 bg-black/40 rounded-full mb-2 overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full ${item.barInfo} shadow-[0_0_8px_currentColor]`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row: Progress Bar */}
            <div className="relative z-10">
                <div className="flex gap-1 h-2 mb-2">
                    {Array.from({ length: segments }).map((_, i) => {
                        const threshold = (i / segments) * 100;
                        const filled = score > threshold;
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-[1px] transition-all duration-300 ${filled ? '' : 'bg-white/5'
                                    }`}
                                style={{
                                    backgroundColor: filled ? primaryColor : undefined,
                                    opacity: filled ? 1 : 0.2,
                                    boxShadow: filled ? `0 0 10px ${primaryColor}` : 'none'
                                }}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-600 tracking-wider uppercase">
                    <span>Minimal</span>
                    <span>Severe</span>
                </div>
            </div>

        </div>
    );
};

export default HallucinationRisk;
