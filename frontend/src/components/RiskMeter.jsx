import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, Activity } from 'lucide-react';

const RiskMeter = ({ level, score }) => {
    const getRiskConfig = (lvl) => {
        switch (lvl) {
            case 'Critical': return { color: 'text-rose-500', barColor: 'bg-rose-500', label: 'CRITICAL RISK' };
            case 'High': return { color: 'text-orange-500', barColor: 'bg-orange-500', label: 'HIGH RISK' };
            case 'Medium': return { color: 'text-amber-400', barColor: 'bg-amber-400', label: 'MEDIUM RISK' };
            default: return { color: 'text-emerald-500', barColor: 'bg-emerald-500', label: 'SECURE' };
        }
    };

    const config = getRiskConfig(level);

    // Calculate segments for visual flair
    const segments = 20;
    const filledSegments = Math.ceil((score / 100) * segments);

    return (
        <div className="h-full p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Hallucination Risk</h4>
                    <span className={`text-sm font-bold tracking-tight ${config.color}`}>{config.label}</span>
                </div>
                <div className="text-right">
                    <span className={`text-4xl font-light ${config.color}`}>{score}%</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between gap-1 h-2">
                    {[...Array(segments)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-300 ${i < filledSegments
                                ? config.barColor
                                : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export default RiskMeter;
