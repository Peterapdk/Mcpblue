
export interface MCPTool {
  name: string;
  description: string;
}

export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'Utility' | 'Database' | 'DevTools' | 'AI' | 'Communication';
  status: 'active' | 'inactive' | 'error';
  config: MCPServerConfig;
  installed: boolean;
  githubUrl?: string;
  icon?: string;
  stars?: number;
  skills?: MCPTool[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  serverIds: string[];
  color: string;
  lastUsed: string;
  secrets?: Record<string, string>; // Project-specific secret overrides
}

export interface Secret {
  id: string;
  key: string;
  value: string;
  description: string;
  lastAccessed?: string;
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  serverId: string;
  serverName: string;
  method: string;
  params: any;
  result?: any;
  status: 'pending' | 'success' | 'error';
  latency: number;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  icon: string;
  serverIds: string[];
  category: string;
}

export interface AppConfig {
  theme: 'dark' | 'light';
  autoUpdate: boolean;
  defaultClient: 'gemini' | 'opencode' | 'custom';
}
