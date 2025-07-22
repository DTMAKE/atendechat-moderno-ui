import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { whatsappService } from '@/services/whatsappService';
import { WhatsAppInstance, WhatsAppMessage, WhatsAppChat } from '@/types/whatsapp';
import { toast } from 'sonner';

interface WhatsAppContextType {
  instances: WhatsAppInstance[];
  activeInstance: WhatsAppInstance | null;
  messages: WhatsAppMessage[];
  chats: WhatsAppChat[];
  loading: boolean;
  
  // Instance operations
  createInstance: (name: string, webhookUrl?: string) => Promise<WhatsAppInstance>;
  deleteInstance: (instanceName: string) => Promise<void>;
  connectInstance: (instanceName: string) => Promise<void>;
  logoutInstance: (instanceName: string) => Promise<void>;
  setActiveInstance: (instance: WhatsAppInstance | null) => void;
  refreshInstances: () => Promise<void>;
  
  // Message operations
  sendMessage: (instanceName: string, phoneNumber: string, message: string) => Promise<void>;
  sendMediaMessage: (instanceName: string, phoneNumber: string, mediaUrl: string, mediaType: 'image' | 'video' | 'audio' | 'document', caption?: string) => Promise<void>;
  getChatMessages: (instanceName: string, phoneNumber: string) => Promise<WhatsAppMessage[]>;
  
  // Chat operations
  getChats: (instanceName: string) => Promise<WhatsAppChat[]>;
  
  // Event handling
  addMessage: (message: WhatsAppMessage) => void;
  updateInstanceStatus: (instanceName: string, status: WhatsAppInstance['status']) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
}

interface WhatsAppProviderProps {
  children: ReactNode;
}

export function WhatsAppProvider({ children }: WhatsAppProviderProps) {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [activeInstance, setActiveInstance] = useState<WhatsAppInstance | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [chats, setChats] = useState<WhatsAppChat[]>([]);
  const [loading, setLoading] = useState(false);

  // Load instances on mount
  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      const instanceList = whatsappService.getAllInstances();
      setInstances(instanceList);
      
      // Set first connected instance as active
      const connectedInstance = instanceList.find(i => i.status === 'connected');
      if (connectedInstance && !activeInstance) {
        setActiveInstance(connectedInstance);
      }
    } catch (error) {
      console.error('Error loading instances:', error);
    }
  };

  const createInstance = async (name: string, webhookUrl?: string): Promise<WhatsAppInstance> => {
    setLoading(true);
    try {
      const instance = await whatsappService.createInstance(name, webhookUrl);
      setInstances(prev => [...prev, instance]);
      toast.success('Instância criada com sucesso!');
      return instance;
    } catch (error) {
      console.error('Error creating instance:', error);
      toast.error('Erro ao criar instância');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInstance = async (instanceName: string): Promise<void> => {
    setLoading(true);
    try {
      await whatsappService.deleteInstance(instanceName);
      setInstances(prev => prev.filter(i => i.instanceName !== instanceName));
      
      // Clear active instance if it was deleted
      if (activeInstance?.instanceName === instanceName) {
        setActiveInstance(null);
      }
      
      toast.success('Instância removida com sucesso!');
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast.error('Erro ao remover instância');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const connectInstance = async (instanceName: string): Promise<void> => {
    setLoading(true);
    try {
      await whatsappService.connectInstance(instanceName);
      
      // Update instance in state
      setInstances(prev => prev.map(i => 
        i.instanceName === instanceName 
          ? { ...i, status: 'connecting', lastUpdate: new Date().toISOString() }
          : i
      ));
      
      toast.success('Conectando instância...');
    } catch (error) {
      console.error('Error connecting instance:', error);
      toast.error('Erro ao conectar instância');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutInstance = async (instanceName: string): Promise<void> => {
    setLoading(true);
    try {
      await whatsappService.logoutInstance(instanceName);
      
      // Update instance in state
      setInstances(prev => prev.map(i => 
        i.instanceName === instanceName 
          ? { ...i, status: 'disconnected', lastUpdate: new Date().toISOString() }
          : i
      ));
      
      // Clear active instance if it was logged out
      if (activeInstance?.instanceName === instanceName) {
        setActiveInstance(null);
      }
      
      toast.success('Instância desconectada com sucesso!');
    } catch (error) {
      console.error('Error logging out instance:', error);
      toast.error('Erro ao desconectar instância');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshInstances = async (): Promise<void> => {
    setLoading(true);
    try {
      await loadInstances();
    } catch (error) {
      console.error('Error refreshing instances:', error);
      toast.error('Erro ao atualizar instâncias');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (instanceName: string, phoneNumber: string, message: string): Promise<void> => {
    try {
      const sentMessage = await whatsappService.sendTextMessage({
        instanceName,
        phoneNumber,
        message,
      });
      
      setMessages(prev => [...prev, sentMessage]);
      toast.success('Mensagem enviada!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
      throw error;
    }
  };

  const sendMediaMessage = async (
    instanceName: string, 
    phoneNumber: string, 
    mediaUrl: string, 
    mediaType: 'image' | 'video' | 'audio' | 'document',
    caption?: string
  ): Promise<void> => {
    try {
      const sentMessage = await whatsappService.sendMediaMessage({
        instanceName,
        phoneNumber,
        message: caption || '',
        mediaUrl,
        mediaType,
        caption,
      });
      
      setMessages(prev => [...prev, sentMessage]);
      toast.success('Mídia enviada!');
    } catch (error) {
      console.error('Error sending media message:', error);
      toast.error('Erro ao enviar mídia');
      throw error;
    }
  };

  const getChatMessages = async (instanceName: string, phoneNumber: string): Promise<WhatsAppMessage[]> => {
    try {
      const chatMessages = await whatsappService.getChatMessages(instanceName, phoneNumber);
      setMessages(prev => {
        // Merge new messages with existing ones, avoiding duplicates
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = chatMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...newMessages];
      });
      return chatMessages;
    } catch (error) {
      console.error('Error getting chat messages:', error);
      toast.error('Erro ao buscar mensagens');
      throw error;
    }
  };

  const getChats = async (instanceName: string): Promise<WhatsAppChat[]> => {
    try {
      const chatList = await whatsappService.getChats(instanceName);
      setChats(chatList);
      return chatList;
    } catch (error) {
      console.error('Error getting chats:', error);
      toast.error('Erro ao buscar conversas');
      throw error;
    }
  };

  const addMessage = (message: WhatsAppMessage) => {
    setMessages(prev => {
      // Check if message already exists
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  };

  const updateInstanceStatus = (instanceName: string, status: WhatsAppInstance['status']) => {
    setInstances(prev => prev.map(i => 
      i.instanceName === instanceName 
        ? { ...i, status, lastUpdate: new Date().toISOString() }
        : i
    ));
    
    // Update active instance if needed
    if (activeInstance?.instanceName === instanceName) {
      setActiveInstance(prev => prev ? { ...prev, status } : null);
    }
  };

  const value: WhatsAppContextType = {
    instances,
    activeInstance,
    messages,
    chats,
    loading,
    createInstance,
    deleteInstance,
    connectInstance,
    logoutInstance,
    setActiveInstance,
    refreshInstances,
    sendMessage,
    sendMediaMessage,
    getChatMessages,
    getChats,
    addMessage,
    updateInstanceStatus,
  };

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
}