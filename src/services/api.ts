// API Service Layer for Sidebar Application
// Handles all communication with the backend database

const API_BASE = 'http://localhost:3001/api/db';

// Types for API responses
export interface Project {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  project_id: string;
  component_type: string;
  name: string;
  position_x: number;
  position_y: number;
  properties: any;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  project_id: string;
  source_component_id: string;
  target_component_id: string;
  connection_type: string;
  properties: any;
  created_at: string;
}

export interface ChatSession {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ScratchNote {
  id: string;
  project_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Project Service
export const projectService = {
  async create(project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  async getAll(): Promise<Project[]> {
    const response = await fetch(`${API_BASE}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  }
};

// Component Service
export const componentService = {
  async create(component: Partial<Component>): Promise<Component> {
    const response = await fetch(`${API_BASE}/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(component),
    });
    if (!response.ok) throw new Error('Failed to create component');
    return response.json();
  },

  async getByProjectId(projectId: string): Promise<Component[]> {
    const response = await fetch(`${API_BASE}/components/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch components');
    return response.json();
  },

  async update(id: string, updates: Partial<Component>): Promise<Component> {
    const response = await fetch(`${API_BASE}/components/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update component');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/components/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete component');
  }
};

// Connection Service
export const connectionService = {
  async create(connection: Partial<Connection>): Promise<Connection> {
    const response = await fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(connection),
    });
    if (!response.ok) throw new Error('Failed to create connection');
    return response.json();
  },

  async getByProjectId(projectId: string): Promise<Connection[]> {
    const response = await fetch(`${API_BASE}/connections/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch connections');
    return response.json();
  }
};

// Chat Service
export const chatService = {
  async createSession(session: Partial<ChatSession>): Promise<ChatSession> {
    const response = await fetch(`${API_BASE}/chat-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to create chat session');
    return response.json();
  },

  async createMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE}/chat-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error('Failed to create chat message');
    return response.json();
  },

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE}/chat-messages/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch chat messages');
    return response.json();
  }
};

// Scratch Note Service
export const scratchNoteService = {
  async create(note: Partial<ScratchNote>): Promise<ScratchNote> {
    const response = await fetch(`${API_BASE}/scratch-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error('Failed to create scratch note');
    return response.json();
  },

  async getByProjectId(projectId: string): Promise<ScratchNote[]> {
    const response = await fetch(`${API_BASE}/scratch-notes/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch scratch notes');
    return response.json();
  },

  async update(id: string, content: string): Promise<ScratchNote> {
    const response = await fetch(`${API_BASE}/scratch-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update scratch note');
    return response.json();
  }
};
