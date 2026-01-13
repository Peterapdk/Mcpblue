
import React, { useState } from 'react';
import { MCPServer, Blueprint } from '../types';
import { 
  Search, Download, Check, Info, Sparkles, Star, Zap, ChevronRight, X, ExternalLink,
  Package, Layers, ArrowUpRight
} from 'lucide-react';

interface MarketplaceProps {
  servers: MCPServer[];
  onToggleInstall: (id: string) => void;
  blueprints: Blueprint[];
  onDeployBlueprint: (bp: Blueprint) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  servers, onToggleInstall, blueprints, onDeployBlueprint 
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'servers' | 'skills' | 'blueprints'>('servers');
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBlueprints = blueprints.filter(bp =>
    bp.name.toLowerCase().includes(search.toLowerCase()) ||
    bp.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protocol Discovery</h1>
          <p className="text-zinc-500 font-medium">Browse servers, individual skills, or complete project blueprints.</p>
        </div>
        
        <div className="flex p-1 bg-zinc-900/80 rounded-2xl border border-white/5 backdrop-blur-sm self-start md:self-auto">
          <button onClick={() => setViewMode('servers')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'servers' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Package className="w-3.5 h-3.5" /> Servers
          </button>
          <button onClick={() => setViewMode('blueprints')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'blueprints' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Layers className="w-3.5 h-3.5" /> Blueprints
          </button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search for capabilities..."
          className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 text-zinc-200 focus:outline-none focus:border-purple-500/50 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {viewMode === 'blueprints' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlueprints.map(bp => (
            <div key={bp.id} className="p-8 rounded-[40px] bg-gradient-to-br from-zinc-900 to-black border border-white/5 hover:border-purple-500/30 transition-all duration-500 group overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/10 transition-all" />
              <div className="flex items-start justify-between mb-8">
                <div className="text-5xl group-hover:scale-110 transition-transform">{bp.icon}</div>
                <div className="px-3 py-1 bg-purple-600/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
                  {bp.category} Pack
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{bp.name}</h3>
              <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{bp.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-10">
                {bp.serverIds.map(sid => (
                  <div key={sid} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-zinc-400">
                    {sid.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onDeployBlueprint(bp)}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" /> Deploy to New Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServers.map(server => (
            <div key={server.id} className="p-7 rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 transition-all duration-500 group flex flex-col h-full">
              <div className="flex justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:rotate-6 transition-all shadow-xl">
                   {server.icon ? <img src={server.icon} alt="" className="w-full h-full object-cover" /> : <div className="text-2xl">📦</div>}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded-lg text-[10px] font-black text-zinc-400">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {server.stars || '420'}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{server.name}</h3>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">by {server.author}</p>
              <p className="text-sm text-zinc-400 mb-8 font-medium line-clamp-2">{server.description}</p>
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <button onClick={() => setSelectedServer(server)} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                  <Info className="w-4 h-4" /> Details
                </button>
                <button
                  onClick={() => onToggleInstall(server.id)}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                    server.installed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 pointer-events-none' : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  {server.installed ? <Check className="w-4 h-4" /> : <><Download className="w-4 h-4 mr-2" /> Install</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedServer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedServer(null)} />
          <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[40px] p-10 animate-in zoom-in-95">
             <div className="flex items-center gap-6 mb-8">
               <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden">
                 {selectedServer.icon ? <img src={selectedServer.icon} className="w-full h-full object-cover" /> : <div className="text-4xl">📦</div>}
               </div>
               <div>
                 <h2 className="text-3xl font-bold">{selectedServer.name}</h2>
                 <p className="text-zinc-500 font-medium tracking-tight">Version {selectedServer.version} • Community Verified</p>
               </div>
             </div>
             <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedServer.skills?.map(s => (
                      <div key={s.name} className="px-3 py-1.5 bg-zinc-800/50 border border-white/5 rounded-xl text-xs font-bold text-purple-400">
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-black/50 border border-white/5 rounded-2xl font-mono text-[10px] text-zinc-600">
                   "command": "{selectedServer.config.command}",<br/>
                   "args": {JSON.stringify(selectedServer.config.args)}
                </div>
             </div>
             <button onClick={() => { onToggleInstall(selectedServer.id); setSelectedServer(null); }} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold shadow-2xl">
               Install Server
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
