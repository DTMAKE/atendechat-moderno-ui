interface EvolutionApiConfig {
  baseUrl: string;
  globalApiKey: string;
}

interface CreateInstanceRequest {
  instanceName: string;
  qrcode: boolean;
  integration: 'WHATSAPP-BAILEYS';
  webhookUrl?: string;
  webhookByEvents?: boolean;
  webhookBase64?: boolean;
  events?: string[];
}

interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    status: string;
  };
  hash: {
    apikey: string;
  };
  webhook?: {
    webhook: string;
    webhookByEvents: boolean;
    webhookBase64: boolean;
    events: string[];
  };
  qrcode?: {
    pairingCode: string;
    code: string;
    base64: string;
  };
}

interface SendTextMessageRequest {
  number: string;
  options?: {
    delay?: number;
    presence?: 'unavailable' | 'available' | 'composing' | 'recording' | 'paused';
  };
  textMessage: {
    text: string;
  };
}

interface SendMediaMessageRequest {
  number: string;
  options?: {
    delay?: number;
    presence?: 'unavailable' | 'available' | 'composing' | 'recording' | 'paused';
  };
  mediaMessage: {
    mediatype: 'image' | 'video' | 'audio' | 'document';
    media: string; // URL or base64
    caption?: string;
    fileName?: string;
  };
}

interface ConnectionState {
  instance: string;
  state: 'close' | 'connecting' | 'open';
}

interface WebhookData {
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message?: any;
    messageTimestamp: number;
    pushName?: string;
    messageType: string;
    source: string;
  };
  destination: string;
  date_time: string;
  sender: string;
  server_url: string;
  apikey: string;
}

class EvolutionApiService {
  private config: EvolutionApiConfig;

  constructor(config: EvolutionApiConfig) {
    this.config = config;
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {},
    instanceApiKey?: string
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'apikey': instanceApiKey || this.config.globalApiKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Evolution API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  // Instance Management
  async createInstance(data: CreateInstanceRequest): Promise<CreateInstanceResponse> {
    return this.makeRequest<CreateInstanceResponse>('/instance/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteInstance(instanceName: string, instanceApiKey: string): Promise<void> {
    return this.makeRequest(`/instance/delete/${instanceName}`, {
      method: 'DELETE',
    }, instanceApiKey);
  }

  async connectInstance(instanceName: string, instanceApiKey: string): Promise<any> {
    return this.makeRequest(`/instance/connect/${instanceName}`, {
      method: 'GET',
    }, instanceApiKey);
  }

  async logoutInstance(instanceName: string, instanceApiKey: string): Promise<void> {
    return this.makeRequest(`/instance/logout/${instanceName}`, {
      method: 'DELETE',
    }, instanceApiKey);
  }

  async restartInstance(instanceName: string, instanceApiKey: string): Promise<void> {
    return this.makeRequest(`/instance/restart/${instanceName}`, {
      method: 'PUT',
    }, instanceApiKey);
  }

  async getConnectionState(instanceName: string, instanceApiKey: string): Promise<ConnectionState> {
    return this.makeRequest<ConnectionState>(`/instance/connectionState/${instanceName}`, {
      method: 'GET',
    }, instanceApiKey);
  }

  async fetchInstances(): Promise<any[]> {
    return this.makeRequest('/instance/fetchInstances', {
      method: 'GET',
    });
  }

  // Message Management
  async sendTextMessage(
    instanceName: string,
    instanceApiKey: string,
    data: SendTextMessageRequest
  ): Promise<any> {
    return this.makeRequest(`/message/sendText/${instanceName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, instanceApiKey);
  }

  async sendMediaMessage(
    instanceName: string,
    instanceApiKey: string,
    data: SendMediaMessageRequest
  ): Promise<any> {
    return this.makeRequest(`/message/sendMedia/${instanceName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, instanceApiKey);
  }

  // Webhook Management
  async setWebhook(
    instanceName: string,
    instanceApiKey: string,
    webhookUrl: string,
    events?: string[],
    webhookByEvents = true,
    webhookBase64 = false
  ): Promise<any> {
    return this.makeRequest(`/webhook/set/${instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        webhook: webhookUrl,
        webhookByEvents,
        webhookBase64,
        events: events || [
          'APPLICATION_STARTUP',
          'QRCODE_UPDATED',
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'MESSAGES_DELETE',
          'SEND_MESSAGE',
          'CONTACTS_SET',
          'CONTACTS_UPSERT',
          'CONTACTS_UPDATE',
          'PRESENCE_UPDATE',
          'CHATS_SET',
          'CHATS_UPSERT',
          'CHATS_UPDATE',
          'CHATS_DELETE',
          'GROUPS_UPSERT',
          'GROUP_UPDATE',
          'GROUP_PARTICIPANTS_UPDATE',
          'CONNECTION_UPDATE',
          'CALL',
          'NEW_JWT_TOKEN'
        ]
      }),
    }, instanceApiKey);
  }

  async findWebhook(instanceName: string, instanceApiKey: string): Promise<any> {
    return this.makeRequest(`/webhook/find/${instanceName}`, {
      method: 'GET',
    }, instanceApiKey);
  }

  // Chat Management
  async findContacts(instanceName: string, instanceApiKey: string): Promise<any> {
    return this.makeRequest(`/chat/findContacts/${instanceName}`, {
      method: 'GET',
    }, instanceApiKey);
  }

  async findChats(instanceName: string, instanceApiKey: string): Promise<any> {
    return this.makeRequest(`/chat/findChats/${instanceName}`, {
      method: 'GET',
    }, instanceApiKey);
  }

  async findMessages(
    instanceName: string,
    instanceApiKey: string,
    remoteJid: string,
    limit = 20
  ): Promise<any> {
    return this.makeRequest(`/chat/findMessages/${instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        where: {
          key: {
            remoteJid
          }
        },
        limit
      }),
    }, instanceApiKey);
  }
}

// Default configuration - pode ser sobrescrito
const defaultConfig: EvolutionApiConfig = {
  baseUrl: 'https://api.agentesdei-a.org',
  globalApiKey: '45eb5e3bc5b405161cf831bf110e6a09',
};

export const evolutionApi = new EvolutionApiService(defaultConfig);

export type {
  EvolutionApiConfig,
  CreateInstanceRequest,
  CreateInstanceResponse,
  SendTextMessageRequest,
  SendMediaMessageRequest,
  ConnectionState,
  WebhookData,
};

export { EvolutionApiService };