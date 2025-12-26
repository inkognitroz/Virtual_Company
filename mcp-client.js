// MCP (Model Context Protocol) Client Module
// This module handles communication with MCP servers

class MCPClient {
    constructor() {
        this.servers = [];
        this.activeConnections = new Map();
        this.loadServers();
    }

    // Load configured servers from localStorage
    loadServers() {
        const stored = localStorage.getItem('virtualCompanyMCPServers');
        this.servers = stored ? JSON.parse(stored) : this.getDefaultServers();
        this.saveServers();
    }

    // Save servers to localStorage
    saveServers() {
        localStorage.setItem('virtualCompanyMCPServers', JSON.stringify(this.servers));
    }

    // Get default MCP server templates
    getDefaultServers() {
        return [
            {
                id: 'filesystem',
                name: 'Filesystem Server',
                description: 'Access and manage files and directories',
                type: 'filesystem',
                enabled: false,
                config: {
                    allowedPaths: ['/documents', '/projects'],
                    readOnly: false
                },
                tools: ['read_file', 'write_file', 'list_directory', 'search_files'],
                resources: ['file_contents', 'directory_structure']
            },
            {
                id: 'database',
                name: 'Database Server',
                description: 'Query and manage database operations',
                type: 'database',
                enabled: false,
                config: {
                    type: 'sqlite',
                    connectionString: ''
                },
                tools: ['execute_query', 'list_tables', 'describe_table'],
                resources: ['table_schema', 'query_results']
            },
            {
                id: 'web-search',
                name: 'Web Search Server',
                description: 'Search the web and retrieve information',
                type: 'web-search',
                enabled: false,
                config: {
                    apiKey: '',
                    provider: 'google'
                },
                tools: ['web_search', 'get_url_content', 'summarize_page'],
                resources: ['search_results', 'page_content']
            },
            {
                id: 'github',
                name: 'GitHub Server',
                description: 'Interact with GitHub repositories',
                type: 'github',
                enabled: false,
                config: {
                    apiToken: '',
                    defaultRepo: ''
                },
                tools: ['list_repos', 'get_file', 'create_issue', 'list_prs'],
                resources: ['repository_info', 'code_content']
            },
            {
                id: 'calendar',
                name: 'Calendar Server',
                description: 'Manage calendar events and schedules',
                type: 'calendar',
                enabled: false,
                config: {
                    provider: 'google',
                    apiKey: ''
                },
                tools: ['create_event', 'list_events', 'update_event', 'delete_event'],
                resources: ['calendar_data', 'upcoming_events']
            }
        ];
    }

    // Add a new MCP server
    addServer(serverConfig) {
        const server = {
            id: `mcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...serverConfig,
            enabled: false,
            createdAt: new Date().toISOString()
        };
        this.servers.push(server);
        this.saveServers();
        return server;
    }

    // Update server configuration
    updateServer(serverId, updates) {
        const index = this.servers.findIndex(s => s.id === serverId);
        if (index !== -1) {
            this.servers[index] = { ...this.servers[index], ...updates };
            this.saveServers();
            return this.servers[index];
        }
        return null;
    }

    // Delete a server
    deleteServer(serverId) {
        this.servers = this.servers.filter(s => s.id !== serverId);
        this.activeConnections.delete(serverId);
        this.saveServers();
    }

    // Enable/disable a server
    toggleServer(serverId, enabled) {
        const server = this.servers.find(s => s.id === serverId);
        if (server) {
            server.enabled = enabled;
            this.saveServers();
            
            if (enabled) {
                this.connectServer(serverId);
            } else {
                this.disconnectServer(serverId);
            }
        }
    }

    // Connect to an MCP server
    async connectServer(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) return false;

        try {
            // Simulate MCP connection
            // In a real implementation, this would establish a connection to the MCP server
            const connection = {
                serverId: server.id,
                status: 'connected',
                connectedAt: new Date().toISOString(),
                tools: server.tools,
                resources: server.resources
            };
            
            this.activeConnections.set(serverId, connection);
            return true;
        } catch (error) {
            console.error(`Failed to connect to server ${serverId}:`, error);
            return false;
        }
    }

    // Disconnect from an MCP server
    disconnectServer(serverId) {
        this.activeConnections.delete(serverId);
    }

    // Get all available tools from connected servers
    getAvailableTools() {
        const tools = [];
        for (const [serverId, connection] of this.activeConnections) {
            const server = this.servers.find(s => s.id === serverId);
            if (server && server.enabled) {
                server.tools.forEach(tool => {
                    tools.push({
                        name: tool,
                        server: server.name,
                        serverId: server.id,
                        type: server.type
                    });
                });
            }
        }
        return tools;
    }

    // Get all available resources from connected servers
    getAvailableResources() {
        const resources = [];
        for (const [serverId, connection] of this.activeConnections) {
            const server = this.servers.find(s => s.id === serverId);
            if (server && server.enabled) {
                server.resources.forEach(resource => {
                    resources.push({
                        name: resource,
                        server: server.name,
                        serverId: server.id,
                        type: server.type
                    });
                });
            }
        }
        return resources;
    }

    // Execute a tool from an MCP server
    async executeTool(serverId, toolName, parameters) {
        const connection = this.activeConnections.get(serverId);
        if (!connection) {
            throw new Error(`Server ${serverId} is not connected`);
        }

        const server = this.servers.find(s => s.id === serverId);
        if (!server || !server.tools.includes(toolName)) {
            throw new Error(`Tool ${toolName} not found on server ${serverId}`);
        }

        try {
            // Simulate tool execution
            // In a real implementation, this would send an MCP request to the server
            const result = await this.simulateToolExecution(server, toolName, parameters);
            return {
                success: true,
                tool: toolName,
                server: server.name,
                result: result
            };
        } catch (error) {
            return {
                success: false,
                tool: toolName,
                server: server.name,
                error: error.message
            };
        }
    }

    // Simulate tool execution (placeholder for real MCP communication)
    async simulateToolExecution(server, toolName, parameters) {
        // Simulate API delay (configurable, default 200ms for better UX)
        const delay = server.config.simulatedDelay || 200;
        await new Promise(resolve => setTimeout(resolve, delay));

        const simulations = {
            'filesystem': {
                'read_file': () => `Contents of file: ${parameters.path || 'example.txt'}`,
                'write_file': () => `Successfully wrote to file: ${parameters.path || 'example.txt'}`,
                'list_directory': () => ['file1.txt', 'file2.js', 'folder1/'],
                'search_files': () => [`Found 3 files matching "${parameters.query || 'search term'}"`]
            },
            'database': {
                'execute_query': () => ({ rows: 5, data: [{ id: 1, name: 'Example' }] }),
                'list_tables': () => ['users', 'projects', 'tasks'],
                'describe_table': () => ({ columns: ['id', 'name', 'created_at'] })
            },
            'web-search': {
                'web_search': () => ({
                    results: [
                        { title: 'Result 1', url: 'https://example.com/1', snippet: 'Example snippet...' },
                        { title: 'Result 2', url: 'https://example.com/2', snippet: 'Another result...' }
                    ]
                }),
                'get_url_content': () => `Content from URL: ${parameters.url || 'https://example.com'}`,
                'summarize_page': () => `Summary of page: Key points include...`
            },
            'github': {
                'list_repos': () => ['repo1', 'repo2', 'repo3'],
                'get_file': () => `// File content from ${parameters.path || 'README.md'}`,
                'create_issue': () => ({ issue: 123, title: parameters.title || 'New Issue' }),
                'list_prs': () => [{ number: 1, title: 'PR #1' }, { number: 2, title: 'PR #2' }]
            },
            'calendar': {
                'create_event': () => ({ eventId: 'evt_123', title: parameters.title || 'New Event' }),
                'list_events': () => [
                    { title: 'Meeting 1', date: '2025-12-27' },
                    { title: 'Meeting 2', date: '2025-12-28' }
                ],
                'update_event': () => ({ eventId: parameters.eventId, updated: true }),
                'delete_event': () => ({ deleted: true })
            }
        };

        const serverSimulations = simulations[server.type];
        if (serverSimulations && serverSimulations[toolName]) {
            return serverSimulations[toolName]();
        }

        return `Executed ${toolName} with parameters: ${JSON.stringify(parameters)}`;
    }

    // Get context from MCP servers for AI
    async getContextForAI(roleInstructions, userMessage) {
        const context = {
            availableTools: this.getAvailableTools(),
            availableResources: this.getAvailableResources(),
            activeServers: Array.from(this.activeConnections.keys()).map(id => {
                const server = this.servers.find(s => s.id === id);
                return server ? server.name : id;
            })
        };

        // Build context string for AI
        let contextString = '';
        
        if (context.activeServers.length > 0) {
            contextString += `\n\nAvailable MCP Servers: ${context.activeServers.join(', ')}`;
        }

        if (context.availableTools.length > 0) {
            contextString += `\n\nAvailable Tools:\n`;
            context.availableTools.forEach(tool => {
                contextString += `- ${tool.name} (from ${tool.server})\n`;
            });
        }

        return {
            context,
            contextString
        };
    }

    // Get all servers
    getServers() {
        return this.servers;
    }

    // Get enabled servers
    getEnabledServers() {
        return this.servers.filter(s => s.enabled);
    }

    // Get server by ID
    getServer(serverId) {
        return this.servers.find(s => s.id === serverId);
    }

    // Check if server is connected
    isConnected(serverId) {
        return this.activeConnections.has(serverId);
    }

    // Get connection status
    getConnectionStatus(serverId) {
        const connection = this.activeConnections.get(serverId);
        return connection ? connection.status : 'disconnected';
    }
}

// Export for use in dashboard
window.MCPClient = MCPClient;
