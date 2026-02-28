import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, User, Plus, Trash2, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, token } = useAuth();
    const [keys, setKeys] = useState([]);
    const [newKey, setNewKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [keyName, setKeyName] = useState('');

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/keys/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setKeys(data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateKey = async () => {
        if (!keyName) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/v1/keys/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: keyName })
            });
            const data = await res.json();
            setNewKey(data);
            setKeyName('');
            fetchKeys();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const revokeKey = async (id) => {
        if (!confirm("Revoke this API Key? It will stop working immediately.")) return;
        try {
            await fetch(`http://localhost:8000/api/v1/keys/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setKeys(keys.filter(k => k.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 mb-2">Settings</h1>
                <p className="text-slate-400">Manage your credentials and security.</p>
            </header>

            <div className="space-y-6">

                {/* Account Section */}
                {user && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><User className="text-cyan-400" size={20} /> Account</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{user.full_name || 'User'}</h4>
                                <p className="text-slate-500 text-sm">{user.email}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Keys Section */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Key className="text-cyan-400" size={20} /> API Keys
                        </h3>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                            <Plus size={16} /> Create New Key
                        </button>
                    </div>

                    {keys.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-slate-800 rounded-xl text-slate-500">
                            No API keys found. Create one to integrate programmatically.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {keys.map(key => (
                                <div key={key.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-slate-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Key size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{key.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">Prefix: {key.key_prefix}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs text-slate-600">Created: {new Date(key.created_at).toLocaleDateString()}</p>
                                        <button
                                            onClick={() => revokeKey(key.id)}
                                            className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors text-slate-500"
                                            title="Revoke Key"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Key Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Generate API Key</h3>

                        {!newKey ? (
                            <>
                                <p className="text-slate-400 text-sm mb-4">Give your key a name to identify where it's used.</p>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="e.g. Production Server, Test Script"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 mb-6 focus:border-cyan-500 outline-none transition-colors"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => { setModalOpen(false); setKeyName(''); }}
                                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={generateKey}
                                        disabled={!keyName || loading}
                                        className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Generating...' : 'Create Key'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6">
                                    <p className="text-emerald-400 text-sm font-bold mb-2 flex items-center gap-2">
                                        <Check size={16} /> Key Generated Successfully
                                    </p>
                                    <p className="text-slate-400 text-xs mb-3">
                                        Copy this key now. You won't be able to see it again.
                                    </p>
                                    <div className="flex items-center gap-2 bg-black/50 p-3 rounded-lg border border-slate-700/50">
                                        <code className="text-emerald-300 font-mono text-sm break-all">{newKey.key}</code>
                                        <button
                                            className="ml-auto text-slate-400 hover:text-white"
                                            onClick={() => navigator.clipboard.writeText(newKey.key)}
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setModalOpen(false); setNewKey(null); }}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors"
                                >
                                    Done
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
