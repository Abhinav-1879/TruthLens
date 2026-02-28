import React, { useState } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, ReferenceArea, Cell
} from 'recharts';

const ConfidenceMatrix = ({ claims }) => {
    // ANTI-GRAVITY MATRIX

    // Data Prep
    const data = claims.map((c, i) => ({
        id: i,
        evidence: (c.status === 'verified' ? 0.9 : 0.1) * 100 + (Math.random() * 10 - 5),
        confidence: c.confidence_score * 100,
        status: c.status
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg text-xs">
                    <div className="font-bold text-slate-300 mb-1">{d.status.toUpperCase()}</div>
                    <div>Conf: {d.confidence.toFixed(1)}%</div>
                    <div>Evid: {d.evidence.toFixed(1)}%</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[350px] bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        type="number" dataKey="evidence" name="Evidence" unit="%"
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                        label={{ value: 'EVIDENCE STRENGTH', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
                    />
                    <YAxis
                        type="number" dataKey="confidence" name="Confidence" unit="%"
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                        label={{ value: 'LLM CONFIDENCE SCORE', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Claims" data={data} fill="#8884d8">
                        {data.map((entry, index) => (
                            <circle
                                key={`cell-${index}`}
                                cx={0} cy={0} r={6}
                                fill={entry.status === 'verified' ? '#10b981' : '#f59e0b'}
                                strokeWidth={2}
                                stroke={entry.status === 'verified' ? '#059669' : '#d97706'}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ConfidenceMatrix;
