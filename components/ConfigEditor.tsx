import React, { useState, useEffect, useRef } from 'react';
import { MCPServer, Secret, MCPTool } from '../types';
import { 
  FileCode, Save, Copy, RotateCcw, HelpCircle, 
  Terminal, Plus, Trash2, Key, Globe, AlertCircle,
  Download, Upload, User, Tag, Sparkles, ChevronDown,
  CloudUpload, Command, Lock, Shield, Edit2
} from 'lucide-react';

interface ConfigEditorProps {
  servers: MCPServer[];
  onUpdateConfig: (id: string, config: any) => void;
  onUpdateSkills?: (id: string, skills: MCPTool[]) => void;
  onUpdateProjectSecrets?: (secrets: Record<string, string>) => void;
  onImportConfigs: (configs: Record<string, any>) => void;
  activeProjectName: string;
  projectSecrets?: Record<string, string>;
  secrets?: Secret[];
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ 
  servers, onUpdateConfig, onUpdateSkills, onUpdateProjectSecrets, onImportConfigs, activeProjectName, projectSecrets = {}, secrets = []
}) => {
  const installedServers = servers.filter(s => s.installed);
  const selectedServerId = installedServers[0]?.id || '';
  const [selectedServer, setSelectedServer] = useState(selectedServerId);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentServer = servers.find(s => s.id === selectedServer);
  const [localConfig, setLocalConfig] = useState(currentServer ? JSON.stringify(currentServer.config, null, 2) : '');
  
  // Property management state
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');

  useEffect(() => {
    try {
      if (localConfig.trim() === '') {
        setJsonError(null);
        return;
      }
      JSON.parse(localConfig);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON');
    }
  }, [localConfig]);

  useEffect(() => {
    if (currentServer) {
      setLocalConfig(JSON.stringify(currentServer.config, null, 2));
    }
  }, [selectedServer, currentServer]);

  // Use explicit casting to Record<string, any> to avoid index signature errors in TypeScript
  const projectManifest = {
    mcpServers: installedServers.reduce((acc, s) => ({
      ...acc,
      [s.id]: s.config
    }), {} as Record<string, any>),
    overrides: projectSecrets
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(projectManifest, null, 2));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(projectManifest, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mcp-config-${activeProjectName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(localConfig);
      onUpdateConfig(selectedServer, parsed);
    } catch (e) {
      alert('Cannot save invalid JSON configuration');
    }
  };

  const handleAddEnv = () => {
    if (!currentServer || !newEnvKey) return;
    const updatedConfig = {
      ...currentServer.config,
      env: {
        ...(currentServer.config.env || {}),
        [newEnvKey]: newEnvValue
      }
    };
    onUpdateConfig(selectedServer, updatedConfig);
    setNewEnvKey('');
    setNewEnvValue('');
  };

  const handleRemoveEnv = (key: string) => {
    if (!currentServer) return;
    const envs = (currentServer.config.env || {}) as Record<string, string>;
    const { [key]: removed, ...rest } = envs;
    const updatedConfig = { ...currentServer.config, env: rest };
    onUpdateConfig(selectedServer, updatedConfig);
  };

  const handleAddSkill = () => {
    if (!currentServer || !newSkillName || !onUpdateSkills) return;
    const updatedSkills = [...(currentServer.skills || []), { name: newSkillName, description: newSkillDesc }];
    onUpdateSkills(selectedServer, updatedSkills);
    setNewSkillName('');
    setNewSkillDesc('');
  };

  const handleRemoveSkill = (index: number) => {
    if (!currentServer || !onUpdateSkills) return;
    const updatedSkills = (currentServer.skills || []).filter((_, i) => i !== index);
    onUpdateSkills(selectedServer, updatedSkills);
  };

  const handleAddSecretOverride = () => {
    if (!newSecretKey || !onUpdateProjectSecrets) return;
    const updatedSecrets = {
      ...projectSecrets,
      [newSecretKey]: newSecretValue
    };
    onUpdateProjectSecrets(updatedSecrets);
    setNewSecretKey('');
    setNewSecretValue('');
  };

  const handleRemoveSecretOverride = (key: string) => {
    if (!onUpdateProjectSecrets) return;
    const secretsObj = projectSecrets as Record<string, string>;
    const { [key]: removed, ...rest } = secretsObj;
    onUpdateProjectSecrets(rest);
  };

  const handleEditSecretOverride = (key: string, value: string) => {
    setNewSecretKey(key);
    setNewSecretValue(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Fixed: Use reader.result and check type to avoid 'unknown' assignability error */}
      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
              try {
                const parsed = JSON.parse(result);
                if (parsed && typeof parsed === 'object' && parsed.mcpServers) {
                  onImportConfigs(parsed.mcpServers);
                }
              } catch (err) { 
                alert('Invalid JSON manifest format'); 
              }
            }
          };
          reader.readAsText(file);
        }
      }} accept=".json" className="hidden" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Project Config</h1>
          <p className="text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Configure skills, environment, and secret overrides for <span className="text-purple-400 font-bold underline decoration-purple-500/30 underline-offset-4">{activeProjectName}</span>.
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-300 border border-white/5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors">
            <Upload className="w-4 h-4" /> Import Manifest
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Server Selection & Context Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Workspace Servers</h3>
          {installedServers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/20 border border-dashed border-white/5 text-center">
              <p className="text-xs text-zinc-600 font-bold mb-2">Workspace is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {installedServers.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedServer(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    selectedServer === s.id
                      ? 'bg-purple-600/10 border-purple-500/30 text-purple-400 shadow-xl scale-[1.02]'
                      : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-[10px] opacity-60 font-mono mt-1">{s.id}</div>
                </button>
              ))}
            </div>
          )}

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 mt-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <CloudUpload className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Client Deployment</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium mb-4">
              Export this project's manifest to your client's config folder.
            </p>
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-black/40 rounded border border-white/5 text-[9px] text-zinc-400 font-mono flex items-center justify-between">
                <span>~/.config/mcp/config.json</span>
                <Copy className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => navigator.clipboard.writeText('~/.config/mcp/config.json')} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor & Properties */}
        <div className="xl:col-span-2 space-y-8">
          {selectedServer && currentServer ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Properties: Skills Management */}
              <div className="p-6 rounded-[32px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Agent Skill Management</h3>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold">{(currentServer.skills || []).length} Active Skills</span>
                </div>

                <div className="space-y-3 mb-6">
                  {(currentServer.skills || []).map((skill, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-black/40 border border-white/5 rounded-xl group">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                          <Tag className="w-3 h-3 text-purple-500" />
                          {skill.name}
                        </div>
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{skill.description}</p>
                      </div>
                      <button onClick={() => handleRemoveSkill(idx)} className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(currentServer.skills || []).length === 0 && (
                    <div className="text-center py-4 text-[10px] text-zinc-600 font-medium italic border border-dashed border-white/5 rounded-xl">
                      No skills defined for this agent.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Skill Name</label>
                     <input 
                       type="text" 
                       value={newSkillName}
                       onChange={(e) => setNewSkillName(e.target.value)}
                       placeholder="e.g. summarize_text"
                       className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/30"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={newSkillDesc}
                         onChange={(e) => setNewSkillDesc(e.target.value)}
                         placeholder="What does it do?"
                         className="flex-1 bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/30"
                       />
                       <button 
                        onClick={handleAddSkill}
                        disabled={!newSkillName}
                        className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg active:scale-90 disabled:opacity-40"
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                </div>
              </div>

              {/* Properties: Env Management */}
              <div className="p-6 rounded-[32px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Environment Variables</h3>
                  </div>
                </div>

                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {Object.entries(currentServer.config.env || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-2.5 bg-black/20 border border-white/5 rounded-xl group">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-zinc-500 w-24 truncate">{key}</span>
                        <span className="text-[10px] font-mono text-zinc-600">••••••••</span>
                      </div>
                      <button onClick={() => handleRemoveEnv(key)} className="p-1 text-zinc-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={newEnvKey}
                      onChange={(e) => setNewEnvKey(e.target.value.toUpperCase())}
                      placeholder="KEY"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-[1.5] flex gap-2 space-y-2">
                    <input 
                      type="text" 
                      value={newEnvValue}
                      onChange={(e) => setNewEnvValue(e.target.value)}
                      placeholder="VALUE"
                      className="flex-1 mt-2 bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                    <button 
                      onClick={handleAddEnv}
                      disabled={!newEnvKey}
                      className="mt-2 p-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties: Project Secret Overrides */}
              <div className="p-6 rounded-[32px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Project Secret Overrides</h3>
                  </div>
                  <span className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest">Context Specific</span>
                </div>

                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {Object.entries(projectSecrets).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-2.5 bg-black/20 border border-white/5 rounded-xl group">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-32 overflow-hidden">
                           <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                           <span className="text-[10px] font-mono text-zinc-300 truncate">{key}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600">••••••••</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditSecretOverride(key, val)} className="p-1 text-zinc-600 hover:text-white transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleRemoveSecretOverride(key)} className="p-1 text-zinc-600 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {Object.keys(projectSecrets).length === 0 && (
                    <div className="text-center py-4 text-[10px] text-zinc-600 font-medium italic">
                      No project-specific overrides defined.
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={newSecretKey}
                      onChange={(e) => setNewSecretKey(e.target.value.toUpperCase())}
                      placeholder="OVERRIDE_KEY"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-[1.5] flex gap-2 space-y-2">
                    <input 
                      type="text" 
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                      placeholder="SECRET_VALUE"
                      className="flex-1 mt-2 bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                    <button 
                      onClick={handleAddSecretOverride}
                      disabled={!newSecretKey}
                      className="mt-2 p-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-600/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced JSON Editor */}
              <div className="rounded-[32px] bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Manifest JSON Editor</span>
                  </div>
                  <button onClick={handleSaveJson} disabled={!!jsonError} className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-500 transition-colors disabled:opacity-40 shadow-lg active:scale-95">
                    <Save className="w-3.5 h-3.5" /> Deploy JSON
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full h-[280px] p-6 bg-transparent text-zinc-400 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-scrollbar"
                    spellCheck={false}
                    value={localConfig}
                    onChange={(e) => setLocalConfig(e.target.value)}
                  />
                  {jsonError && (
                    <div className="absolute bottom-4 left-6 right-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-bold backdrop-blur-md">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {jsonError}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Manifest Payload */}
              <div className="rounded-[32px] bg-zinc-900/30 border border-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{activeProjectName} Snapshot</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-[10px] font-bold hover:bg-zinc-700 transition-colors">
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-zinc-300 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-colors">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl max-h-48 overflow-y-auto font-mono text-[9px] text-zinc-600 border border-white/5 custom-scrollbar">
                  {/* Fixed: Line 370 approx, ensure result is stringified safely */}
                  <pre>{JSON.stringify(projectManifest, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[500px] rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/10 backdrop-blur-sm">
              <Command className="w-12 h-12 mb-4 opacity-10" />
              <p className="italic font-medium">Select an active server in {String(activeProjectName)} to configure capabilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};