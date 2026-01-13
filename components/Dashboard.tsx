
import React, { useState, useEffect } from 'react';
import { MCPServer } from '../types';
import { Power, Activity, Server, AlertCircle, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  servers: MCPServer[];
  onToggleInstall: (id: string) => void;
}

const mockUsageData = [
  { name: 'Mon', calls: 400 },
  { name: 'Tue', calls: 300 },
  { name: 'Wed', calls: 600 },
  { name: 'Thu', calls: 800 },
  { name: 'Fri', calls: 500 },
  { name: 'Sat', calls: 200 },
  { name: 'Sun', calls: 150 },
];

export const Dashboard: React.FC<DashboardProps> = ({ servers, onToggleInstall }) => {
  const installedServers = servers.filter(s => s.installed);
  const activeCount = installedServers.filter(s => s.status === 'active').length;
  
  // Use a state-based width hack to ensure Recharts triggers a re-measurement after initial mount
  const [chartWidth, setChartWidth] = useState<string | number>('99.9%');

  useEffect(() => {
    const timer = setTimeout(() => setChartWidth('100%'), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">System Overview</h1>
          <p className="text-zinc-500 font-medium">Monitoring {installedServers.length} active protocols in your local runtime.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg active:scale-95">
            Run Health Check
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Servers', value: activeCount, icon: Power, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
          { label: 'Total Calls (24h)', value: '2.4k', icon: Activity, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
          { label: 'Total Capacity', value: '12/50', icon: Server, color: 'text-purple-400', glow: 'shadow-purple-500/10' },
          { label: 'Latency (Avg)', value: '14ms', icon: Activity, color: 'text-amber-400', glow: 'shadow-amber-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm transition-all hover:border-white/10 shadow-lg ${stat.glow}`}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-[0.2em]">Live</span>
            </div>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Graph - Fixed relative container with min-height */}
        <div className="lg:col-span-2 p-7 rounded-3xl bg-zinc-900/30 border border-white/5 flex flex-col min-w-0 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-purple-500" />
              Request Volume History
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
            </div>
          </div>
          
          <div className="flex-1 w-full relative min-h-[250px]">
            <div className="absolute inset-0">
              <ResponsiveContainer width={chartWidth} height="100%">
                <BarChart data={mockUsageData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" strokeOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 11, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 11, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#a855f7' }}
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="calls" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Feed */}
        <div className="p-7 rounded-3xl bg-zinc-900/30 border border-white/5 flex flex-col h-[400px]">
          <h3 className="text-xs font-bold text-zinc-400 mb-6 flex items-center gap-2 uppercase tracking-widest shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            System Events
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { type: 'info', msg: 'Postgres MCP restarted', time: '2m ago' },
              { type: 'success', msg: 'Search MCP config updated', time: '1h ago' },
              { type: 'warning', msg: 'High latency detected in Slack server', time: '3h ago' },
              { type: 'error', msg: 'Github authentication failed', time: '5h ago' },
              { type: 'info', msg: 'Automatic backup completed', time: '12h ago' },
              { type: 'success', msg: 'System check: 100% healthy', time: '1d ago' },
              { type: 'info', msg: 'Node upgrade available v1.3.0', time: '2d ago' },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 text-xs group">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-all group-hover:scale-150 ${
                  event.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                  event.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 
                  event.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                }`} />
                <div className="flex-1">
                  <p className="text-zinc-300 leading-tight font-semibold">{event.msg}</p>
                  <p className="text-[10px] text-zinc-600 mt-1 font-bold">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Installed Servers List */}
      <section className="pb-12">
        <h2 className="text-xl font-bold mb-6 tracking-tight">Installed Protocols</h2>
        {installedServers.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-zinc-900/10 backdrop-blur-sm">
            <Server className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 mb-6 font-bold text-lg">No active protocols installed.</p>
            <button className="px-6 py-3 bg-zinc-800 text-white rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all border border-white/5">
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {installedServers.map(server => (
              <div key={server.id} className="group p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-zinc-900/60 transition-all duration-500 shadow-xl">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 overflow-hidden shadow-2xl">
                      {server.icon ? <img src={server.icon} alt="" className="w-full h-full object-cover" /> : <Server className="w-7 h-7 text-zinc-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-none mb-1.5">{server.name}</h4>
                      <p className="text-[11px] text-zinc-500 font-extrabold uppercase tracking-widest">{server.category} • V{server.version}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                    server.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {server.status}
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 line-clamp-2 mb-8 h-10 leading-relaxed font-medium">
                  {server.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-2">
                    <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Edit Config">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="View Logs">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => onToggleInstall(server.id)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black text-red-500/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all uppercase tracking-wider"
                  >
                    <Trash2 className="w-4 h-4" />
                    Uninstall
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
