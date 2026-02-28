import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, Cpu, ShieldCheck, FileText, Zap } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Layout = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const { logout, user } = useAuth();

    if (isLanding) {
        return <Outlet />;
    }

    return (
        <div className="flex h-screen overflow-hidden selection:bg-fuchsia-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Sidebar - Floating Glass Island */}
            <aside className="relative z-10 w-72 p-6 flex flex-col hidden md:flex">
                <div className="flex-1 glass-crazy rounded-3xl flex flex-col overflow-hidden border-gradient-monitor transition-all duration-300 hover:shadow-fuchsia-500/10">

                    {/* Header */}
                    <div className="h-24 flex items-center px-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center space-x-3 group">
                            <div className="p-2 bg-gradient-to-tr from-fuchsia-500 to-violet-600 rounded-lg shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-fuchsia-200 group-hover:to-violet-200 transition-all">
                                TruthLens
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">Main</div>
                        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Analysis Hub" />
                        <NavItem to="/audit" icon={<ShieldCheck size={20} />} label="Audit Core" />

                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2 mt-6">Data</div>
                        <NavItem to="/history" icon={<History size={20} />} label="Archives" />
                        <NavItem to="/executive-report" icon={<FileText size={20} />} label="Exec Reports" />

                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2 mt-6">System</div>
                        <NavItem to="/settings" icon={<Settings size={20} />} label="Config" />
                    </nav>

                    {/* Footer / User */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        {user && (
                            <div className="mb-4 px-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                                        {user.full_name ? user.full_name[0] : 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-200 truncate">{user.full_name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={logout}
                            className="group flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all duration-300"
                        >
                            <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                            <span className="text-sm font-medium text-gray-400 group-hover:text-red-300 transition-colors">Disconnect</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth">
                <div className="max-w-7xl mx-auto h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
        }
    >
        {({ isActive }) => (
            <>
                {/* Active Background Glow */}
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/10 border border-fuchsia-500/20 rounded-xl" />
                )}

                {/* Icon Glow */}
                <span className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]' : ''}`}>
                    {icon}
                </span>

                {/* Label */}
                <span className={`relative z-10 font-medium tracking-wide ${isActive ? 'text-glow-primary' : ''}`}>
                    {label}
                </span>

                {/* Hover Indicator */}
                {!isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-fuchsia-500 opacity-0 group-hover:h-1/2 group-hover:opacity-100 transition-all duration-300 rounded-r-full" />
                )}
            </>
        )}
    </NavLink>
);

export default Layout;
