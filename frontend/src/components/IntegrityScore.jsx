import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const IntegrityScore = ({ score }) => {
    // ANTI-GRAVITY COLOR LOGIC
    const getColor = (val) => {
        if (val < 30) return '#be185d'; // Infrared Magenta (Critical)
        if (val < 70) return '#f59e0b'; // Amber (Warning) - Kept for visibility
        return '#d946ef'; // Plasma Violet (Stable) - Replaces Green
    };

    const color = getColor(score);

    return (
        <div className="relative w-48 h-48 mx-auto">
            {/* Outer Rotating Ring (Reactor Effect) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border-2 border-dashed rounded-full opacity-30"
                style={{ borderColor: color }}
            />

            {/* Inner Pulsing Ring */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-[-4px] rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />

            <CircularProgressbarWithChildren
                value={score}
                strokeWidth={6}
                styles={buildStyles({
                    pathColor: color,
                    trailColor: 'rgba(255, 255, 255, 0.05)',
                    strokeLinecap: 'butt',
                    rotation: 0.5, // Start at bottom
                    pathTransitionDuration: 1.5,
                })}
            >
                <div className="flex flex-col items-center justify-center text-center z-10">
                    <span className="text-xs text-gray-500 font-hacker tracking-widest uppercase mb-1">
                        System Integrity
                    </span>
                    <div className="text-4xl font-bold font-hacker" style={{ color: color, textShadow: `0 0 15px ${color}` }}>
                        {score}%
                    </div>
                </div>
            </CircularProgressbarWithChildren>

            {/* Decorative particles */}
            <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-white/30 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-1 bg-white/30 -translate-x-1/2" />
        </div>
    );
};

export default IntegrityScore;
