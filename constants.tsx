
import { MCPServer, Blueprint } from './types';

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'bp-researcher',
    name: 'The Academic Researcher',
    description: 'A powerhouse for deep technical research and data gathering.',
    icon: '🔬',
    serverIds: ['google-search-mcp', 'wikipedia-mcp', 'arxiv-mcp'],
    category: 'Research'
  },
  {
    id: 'bp-fullstack',
    name: 'Fullstack Orchestrator',
    description: 'Perfect for OpenCode users managing codebases and deployments.',
    icon: '⚡',
    serverIds: ['github-mcp', 'docker-mcp', 'postgres-inspector'],
    category: 'Development'
  },
  {
    id: 'bp-agent-os',
    name: 'Office Agent OS',
    description: 'The ultimate personal assistant for project management.',
    icon: '🏢',
    serverIds: ['notion-mcp', 'slack-connector', 'google-calendar-mcp'],
    category: 'Productivity'
  }
];

export const INITIAL_SERVERS: MCPServer[] = [
  {
    id: 'google-search-mcp',
    name: 'Google Search',
    description: 'Enables Gemini and OpenCode to perform real-time web searches and extract information.',
    version: '1.2.0',
    author: 'Google',
    category: 'Utility',
    status: 'active',
    installed: true,
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-google-search'],
      env: { GOOGLE_API_KEY: '********' }
    },
    skills: [
      { name: 'search_web', description: 'Search the public internet for queries and retrieve ranked results.' },
      { name: 'get_news', description: 'Fetch latest headlines and articles for a specific topic or keyword.' },
      { name: 'extract_page_content', description: 'Crawl a specific URL and return its text content cleaned of boilerplates.' }
    ]
  },
  {
    id: 'postgres-inspector',
    name: 'PostgreSQL Inspector',
    description: 'Schema inspection and query execution for PostgreSQL databases.',
    version: '0.9.5',
    author: 'MCP Community',
    category: 'Database',
    status: 'inactive',
    installed: true,
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-postgres'],
      env: { DATABASE_URL: 'postgresql://localhost:5432/mydb' }
    },
    skills: [
      { name: 'list_tables', description: 'List all tables available in the currently connected database schema.' },
      { name: 'execute_query', description: 'Execute a read-only SQL query and return the result set as JSON.' },
      { name: 'describe_table', description: 'Get detailed column types, indexes, and constraints for a specific table.' }
    ]
  },
  {
    id: 'notion-mcp',
    name: 'Notion Connector',
    description: 'Full access to Notion workspaces, including pages, databases, and blocks.',
    version: '1.4.2',
    author: 'Smithery Community',
    category: 'Utility',
    status: 'inactive',
    installed: false,
    stars: 2100,
    config: {
      command: 'npx',
      args: ['-y', '@smithery/mcp-notion'],
      env: { NOTION_TOKEN: '' }
    },
    skills: [
      { name: 'search_notion', description: 'Search for pages or databases by title in the authorized workspace.' },
      { name: 'append_block', description: 'Add new content blocks (text, todo, images) to an existing page.' },
      { name: 'query_database', description: 'Filter and sort items within a specific Notion database.' }
    ]
  },
  {
    id: 'github-mcp',
    name: 'GitHub Manager',
    description: 'Manage repositories, issues, and PRs directly through your AI assistant.',
    version: '2.1.0',
    author: 'GitHub',
    category: 'DevTools',
    status: 'active',
    installed: false,
    stars: 1240,
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' }
    },
    skills: [
      { name: 'create_issue', description: 'Open a new issue in a specific repository with labels and assignees.' },
      { name: 'list_prs', description: 'Retrieve a list of active pull requests for a given repository.' },
      { name: 'get_repo_contents', description: 'Download or read the content of files from a specific branch.' }
    ]
  },
  {
    id: 'slack-connector',
    name: 'Slack Integration',
    description: 'Send messages and monitor channels in your Slack workspace.',
    version: '1.0.4',
    author: 'Slack',
    category: 'Communication',
    status: 'inactive',
    installed: false,
    stars: 850,
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-slack'],
      env: { SLACK_BOT_TOKEN: '' }
    },
    skills: [
      { name: 'send_message', description: 'Post a new message to a specific channel or user ID.' },
      { name: 'list_channels', description: 'Get a list of all public and private channels accessible to the bot.' },
      { name: 'search_messages', description: 'Find specific messages across the workspace history.' }
    ]
  },
  {
    id: 'docker-mcp',
    name: 'Docker Manager',
    description: 'Control local Docker containers and view system logs.',
    version: '0.8.0',
    author: 'Community',
    category: 'DevTools',
    status: 'inactive',
    installed: false,
    stars: 560,
    config: {
      command: 'npx',
      args: ['-y', '@mcp-get/docker-server'],
      env: {}
    },
    skills: [
      { name: 'list_containers', description: 'List all running and stopped Docker containers on the host.' },
      { name: 'get_container_logs', description: 'Fetch the stdout/stderr logs for a specific container ID.' },
      { name: 'restart_container', description: 'Trigger a restart for a specific Docker container.' }
    ]
  }
];
