import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatService, type ChatSession, type ChatMessage } from '../services/api';
import { useProject } from './ProjectContext';

// establish type for messages to differentiate between user and assistant
export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// typing for chatContext
type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentSession: ChatSession | null;
  saveMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
  loadChatHistory: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// okay we need a function thats going to establish the chatContext when invoked
export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  // just like the board context, we need to throw an error if the context
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};

// create chat state here to make available by freshly loaded chat component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const { currentProject } = useProject();

  // Convert database chat messages to local message format
  const convertChatMessages = (chatMessages: ChatMessage[]): Message[] => {
    return chatMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }));
  };

  // Create or get current chat session
  const ensureSession = useCallback(async (): Promise<ChatSession> => {
    if (currentSession) return currentSession;
    
    if (!currentProject) {
      throw new Error('No current project available');
    }

    try {
      const newSession = await chatService.createSession({
        project_id: currentProject.id,
      });
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw error;
    }
  }, [currentSession, currentProject]);

  // Save a message to the database
  const saveMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    try {
      const session = await ensureSession();
      await chatService.createMessage({
        session_id: session.id,
        role,
        content,
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [ensureSession]);

  // Load chat history for current project
  const loadChatHistory = useCallback(async () => {
    if (!currentProject) {
      setMessages([]);
      setCurrentSession(null);
      return;
    }

    try {
      // For now, create a new session if none exists
      // In production, you might want to load the most recent session
      const session = await ensureSession();
      const chatMessages = await chatService.getMessagesBySessionId(session.id);
      const convertedMessages = convertChatMessages(chatMessages);
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    }
  }, [currentProject, ensureSession]);

  // Load chat history when project changes
  useEffect(() => {
    setCurrentSession(null); // Reset session when project changes
    loadChatHistory();
  }, [currentProject, loadChatHistory]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        isLoading,
        setIsLoading,
        currentSession,
        saveMessage,
        loadChatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
