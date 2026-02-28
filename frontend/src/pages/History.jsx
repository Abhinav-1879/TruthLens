import React, { useEffect, useState } from 'react';
import { Clock, Trash2, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const History = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ trend: [], risk_distribution: [], average_trust: 0, total_scans: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [historyRes, statsRes] = await Promise.all([
                fetch('http://localhost:8000/api/v1/history', { headers }),
                fetch('http://localhost:8000/api/v1/history/stats', { headers })
            ]);

            if (historyRes.status === 401 || statsRes.status === 401) {
                // Token invalid or expired
                // Ideally redirect to login, but Layout handles logout manually for now
                return;
            }

            const historyData = await historyRes.json();
            const statsData = await statsRes.json();

            setHistory(historyData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8000/api/v1/history/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHistory(history.filter(h => h.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-cyan-400" />
                        Trust Timeline
                    </h1>
                    <p className="text-slate-400">Longitudinal analysis of AI truthfulness.</p>
                </div>
                <div className="flex gap-8 text-sm">
                    <div className="text-right">
                        <p className="text-slate-500 uppercase text-xs font-bold tracking-wider">Avg Trust Score</p>
                        <p className="text-2xl font-bold text-cyan-400">{stats.average_trust}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 uppercase text-xs font-bold tracking-wider">Total Scans</p>
                        <p className="text-2xl font-bold text-white">{stats.total_scans}</p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-40">
                    <Activity className="animate-spin text-cyan-500 w-10 h-10" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visual Analytics Column 1: Trend */}
                    <div className="lg:col-span-2 h-80 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Trust Trend (Last 30 Days)</h3>
                        <div className="absolute inset-0 top-12 bottom-0 left-0 right-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#475569"
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#bae6fd' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorTrust)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Visual Analytics Column 2: Risk Hotspots */}
                    <div className="lg:col-span-1 h-80 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Hotspots</h3>
                        <div className="h-full w-full">
                            {stats.risk_distribution && stats.risk_distribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="85%">
                                    <PieChart>
                                        <Pie
                                            data={stats.risk_distribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.risk_distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-600 text-sm">No risks detected yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-4">Recent Audits</h3>
                        {history.length === 0 ? (
                            <div className="text-center p-20 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                                No history found. Start analyzing!
                            </div>
                        ) : (
                            history.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id}
                                    className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all group flex items-center justify-between cursor-pointer"
                                    onClick={() => {/* Navigate to details maybe? */ }}
                                >
                                    <div className="flex items-center gap-6 overflow-hidden">
                                        <div className={`
                                            w-14 h-14 rounded-lg flex flex-col items-center justify-center font-bold text-lg
                                            ${item.overall_trust_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                item.overall_trust_score >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'}
                                        `}>
                                            <span>{item.overall_trust_score}</span>
                                            <span className="text-[10px] uppercase opacity-60 font-medium">Score</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.audit_decision === 'REJECT' ? 'bg-rose-500 text-white' :
                                                    item.audit_decision === 'SHIP' ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-white'
                                                    }`}>
                                                    {item.audit_decision || 'PENDING'}
                                                </span>
                                                <h4 className="font-medium text-slate-200 truncate">{item.text_content.substring(0, 60)}...</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.created_at).toLocaleString()}</span>
                                                <span className="hidden md:inline text-slate-600">ID: {item.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
