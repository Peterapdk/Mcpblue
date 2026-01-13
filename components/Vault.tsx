
import React, { useState } from 'react';
import { Secret } from '../types';
import { Key, Eye, EyeOff, Trash2, Plus, Shield, Search, Copy, Check } from 'lucide-react';

interface VaultProps {
  secrets: Secret[];
  onAddSecret: (secret: Secret) => void;
  onDeleteSecret: (id: string) => void;
}

export const Vault: React.FC<VaultProps> = ({ secrets, onAddSecret, onDeleteSecret }) => {
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const toggleVisibility = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKey && newValue) {
      onAddSecret({
        id: `sec-${Math.random().toString(36).substr(2, 9)}`,
        key: newKey,
        value: newValue,
        description: 'Added via Vault UI'
      });
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Secrets Vault</h1>
        <p className="text-zinc-500 font-medium">Manage API keys and sensitive environment variables safely.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Credentials</h3>
            <span className="text-[10px] text-zinc-600 font-bold">{secrets.length} Secrets Stored</span>
          </div>

          <div className="space-y-3">
            {secrets.map((secret) => (
              <div key={secret.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 group hover:border-purple-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{secret.key}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-zinc-500">
                          {showValues[secret.id] ? secret.value : '••••••••••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleVisibility(secret.id)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                      {showValues[secret.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleCopy(secret.id, secret.value)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                      {copiedId === secret.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => onDeleteSecret(secret.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-zinc-900 to-black border border-white/5 shadow-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" /> New Secret
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Variable Name</label>
                <input 
                  type="text" 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                  placeholder="GITHUB_TOKEN" 
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/30" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secret Value</label>
                <input 
                  type="password" 
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Sensitive value..." 
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/30" 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg">
                Add to Vault
              </button>
            </form>
          </div>

          <div className="p-6 rounded-[32px] border border-dashed border-white/10 text-center">
            <Shield className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
            <p className="text-[11px] text-zinc-500 font-medium">All secrets are stored in your browser's local storage and are never sent to external servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
