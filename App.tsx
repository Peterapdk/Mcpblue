
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { ConfigEditor } from './components/ConfigEditor';
import { Vault } from './components/Vault';
import { LiveGateway } from './components/LiveGateway';
import { INITIAL_SERVERS, BLUEPRINTS } from './constants';
import { MCPServer, Project, Secret, LiveEvent, Blueprint, MCPTool } from './types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-global',
    name: 'Main Workspace',
    description: 'The default global project for all general purpose MCP tools.',
    serverIds: ['google-search-mcp', 'postgres-inspector'],
    color: '#9333ea',
    lastUsed: new Date().toISOString(),
    secrets: { 'OVERRIDE_MODE': 'true' }
  },
  {
    id: 'proj-web-dev',
    name: 'OpenCode Web',
    description: 'Specific tools for frontend engineering and web development.',
    serverIds: ['github-mcp', 'google-search-mcp'],
    color: '#3b82f6',
    lastUsed: new Date().toISOString(),
    secrets: {}
  }
];

const INITIAL_SECRETS: Secret[] = [
  { id: 'sec-1', key: 'GOOGLE_API_KEY', value: 'AIzaSyC...', description: 'Cloud console search key' },
  { id: 'sec-2', key: 'GITHUB_TOKEN', value: 'ghp_451...', description: 'Personal repo access' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'config' | 'vault' | 'live'>('dashboard');
  const [servers, setServers] = useState<MCPServer[]>(INITIAL_SERVERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [secrets, setSecrets] = useState<Secret[]>(INITIAL_SECRETS);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Simulate Live Events
  useEffect(() => {
    const interval = setInterval(() => {
      const activeProject = projects.find(p => p.id === activeProjectId);
      if (!activeProject || activeProject.serverIds.length === 0) return;

      const randomServerId = activeProject.serverIds[Math.floor(Math.random() * activeProject.serverIds.length)];
      const server = servers.find(s => s.id === randomServerId);
      if (!server) return;

      const newEvent: LiveEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        serverId: server.id,
        serverName: server.name,
        method: server.skills?.[0]?.name || 'ping',
        params: { q: 'How to build an MCP server' },
        result: { status: 'ok', data: 'Found 12 results' },
        status: Math.random() > 0.1 ? 'success' : 'error',
        latency: Math.floor(Math.random() * 200) + 10
      };

      setLiveEvents(prev => [newEvent, ...prev].slice(0, 50));
    }, 8000);
    return () => clearInterval(interval);
  }, [activeProjectId, projects, servers]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId) || projects[0],
  [projects, activeProjectId]);

  const projectServers = useMemo(() => {
    return servers.map(s => ({
      ...s,
      installed: activeProject.serverIds.includes(s.id),
      status: activeProject.serverIds.includes(s.id) ? s.status : 'inactive' as const
    }));
  }, [servers, activeProject]);

  const toggleInstall = (id: string) => {
    const isCurrentlyInstalled = activeProject.serverIds.includes(id);
    
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const newServerIds = isCurrentlyInstalled 
          ? p.serverIds.filter(sid => sid !== id)
          : [...p.serverIds, id];
        return { ...p, serverIds: newServerIds };
      }
      return p;
    }));

    const server = servers.find(s => s.id === id);
    setNotification({
      message: `${server?.name} ${isCurrentlyInstalled ? 'removed from' : 'added to'} ${activeProject.name}.`,
      type: 'success'
    });
  };

  const deployBlueprint = (blueprint: Blueprint) => {
    const newProject: Project = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name: blueprint.name,
      description: blueprint.description,
      serverIds: blueprint.serverIds,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      lastUsed: new Date().toISOString(),
      secrets: {}
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setActiveTab('dashboard');
    setNotification({ message: `Blueprint "${blueprint.name}" deployed!`, type: 'success' });
  };

  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      serverIds: [],
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      lastUsed: new Date().toISOString(),
      secrets: {}
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setNotification({ message: `Project "${name}" created.`, type: 'success' });
  };

  const updateServerConfig = (id: string, newConfig: any) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, config: newConfig } : s
    ));
    setNotification({ message: 'Configuration saved globally.', type: 'success' });
  };

  const updateServerSkills = (id: string, newSkills: MCPTool[]) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, skills: newSkills } : s
    ));
    setNotification({ message: 'Agent skills updated.', type: 'success' });
  };

  const updateProjectSecrets = (newSecrets: Record<string, string>) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, secrets: newSecrets } : p
    ));
    setNotification({ message: 'Project secret overrides updated.', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-purple-500/30 overflow-hidden">
      {notification && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-right-8 duration-500 font-bold text-sm ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
             {notification.message}
          </div>
        </div>
      )}

      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectChange={setActiveProjectId}
        onCreateProject={createProject}
      >
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
          <div className="mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: activeProject.color }} />
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Context</span>
               <h2 className="text-sm font-bold text-zinc-200">{activeProject.name}</h2>
             </div>
          </div>

          {activeTab === 'dashboard' && (
            <Dashboard 
              servers={projectServers} 
              onToggleInstall={toggleInstall} 
              liveEvents={liveEvents.filter(e => activeProject.serverIds.includes(e.serverId))}
            />
          )}
          {activeTab === 'marketplace' && (
            <Marketplace 
              servers={projectServers} 
              onToggleInstall={toggleInstall} 
              blueprints={BLUEPRINTS}
              onDeployBlueprint={deployBlueprint}
            />
          )}
          {activeTab === 'config' && (
            <ConfigEditor 
              servers={projectServers} 
              onUpdateConfig={updateServerConfig} 
              onUpdateSkills={updateServerSkills}
              onUpdateProjectSecrets={updateProjectSecrets}
              onImportConfigs={() => {}} 
              activeProjectName={activeProject.name}
              projectSecrets={activeProject.secrets || {}}
              secrets={secrets}
            />
          )}
          {activeTab === 'vault' && (
            <Vault 
              secrets={secrets} 
              onAddSecret={(s) => setSecrets(p => [...p, s])} 
              onDeleteSecret={(id) => setSecrets(p => p.filter(s => s.id !== id))}
            />
          )}
          {activeTab === 'live' && (
            <LiveGateway events={liveEvents} />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default App;
