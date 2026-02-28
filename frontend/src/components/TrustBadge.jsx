import React from 'react';
import { FiShield, FiCheck, FiX } from 'react-icons/fi';

const TrustBadge = ({ status = 'VERIFIED', score = 100, size = 'md' }) => {
    const isVerified = status === 'VERIFIED' || score >= 85;

    const sizeClasses = {
        sm: 'w-24 h-24 text-xs',
        md: 'w-32 h-32 text-sm',
        lg: 'w-48 h-48 text-base'
    };

    return (
        <div className={`relative ${sizeClasses[size]} rounded-full border ${isVerified ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-rose-500/50 bg-rose-950/30'} flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] font-sans select-none transform transition-transform hover:scale-105`}>

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full opacity-20 blur-xl ${isVerified ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            {/* Outer Ring Text */}
            <div className="absolute top-2 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                TruthLens
            </div>

            {/* Icon */}
            <div className={`mb-1 relative z-10 ${isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isVerified ? <FiShield size={size === 'lg' ? 48 : 32} /> : <FiX size={size === 'lg' ? 48 : 32} />}
            </div>

            {/* Status Text */}
            <div className={`relative z-10 font-black tracking-tight leading-none ${isVerified ? 'text-emerald-300' : 'text-rose-300'} drop-shadow-md`}>
                {isVerified ? 'VERIFIED' : 'REJECTED'}
            </div>

            {/* Score */}
            <div className="relative z-10 text-xs font-bold text-gray-400 mt-1 font-mono">
                {score}/100
            </div>

            {/* Bottom Ring Check */}
            {isVerified && (
                <div className="absolute bottom-2 text-emerald-500/80">
                    <FiCheck size={16} />
                </div>
            )}
        </div>
    );
};

export default TrustBadge;
