
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Settings, Github, Zap, ShieldCheck, 
  Plus, ChevronRight, X, Briefcase, Key, Activity
} from 'lucide-react';
import { Project } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'marketplace' | 'config' | 'vault' | 'live';
  onTabChange: (tab: any) => void;
  projects: Project[];
  activeProjectId: string;
  onProjectChange: (id: string) => void;
  onCreateProject: (name: string, description: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, onTabChange, projects, activeProjectId, onProjectChange, onCreateProject 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'config', label: 'Manifests', icon: Settings },
    { id: 'vault', label: 'Secrets Vault', icon: Key },
    { id: 'live', label: 'Live Gateway', icon: Activity },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjName.trim()) {
      onCreateProject(newProjName, newProjDesc);
      setShowCreateModal(false);
      setNewProjName('');
      setNewProjDesc('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a]">
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl flex flex-col sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Workspace</span>
            <button onClick={() => setShowCreateModal(true)} className="p-1 hover:bg-white/5 rounded-md text-zinc-500 hover:text-purple-400 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => onProjectChange(proj.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all border ${
                  activeProjectId === proj.id ? 'bg-zinc-900 border-white/10 text-white shadow-lg' : 'text-zinc-500 hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                  <span className="font-bold text-xs truncate">{proj.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5 mx-6 my-4" />

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-lg' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Cloud Sync</span>
             </div>
             <p className="text-[10px] text-zinc-500 mb-3 font-medium">Local workspace synced across devices.</p>
             <a href="#" className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"><Github className="w-3 h-3" /> Model Context Protocol</a>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-[40]">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Engine</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-lg border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase">{activeTab}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-6">New Project Context</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Name</label>
                <input type="text" autoFocus required placeholder="e.g. Analysis Workspace" value={newProjName} onChange={(e) => setNewProjName(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg">Initialize Workspace</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
