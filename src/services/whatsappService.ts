import { evolutionApi } from './evolutionApi';
import { 
  WhatsAppInstance, 
  WhatsAppMessage, 
  SendMessageRequest, 
  WhatsAppContact,
  WhatsAppChat 
} from '@/types/whatsapp';

// Service layer for WhatsApp operations using Evolution API
class WhatsAppService {
  private instances: Map<string, WhatsAppInstance> = new Map();

  // Instance Management
  async createInstance(name: string, webhookUrl?: string): Promise<WhatsAppInstance> {
    try {
      const response = await evolutionApi.createInstance({
        instanceName: name,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        webhookUrl,
        webhookByEvents: true,
        webhookBase64: false,
      });

      const instance: WhatsAppInstance = {
        instanceName: response.instance.instanceName,
        instanceId: response.instance.instanceId,
        apiKey: response.hash.apikey,
        status: 'qr_code',
        qrCode: response.qrcode?.base64,
        lastUpdate: new Date().toISOString(),
        webhookUrl,
      };

      this.instances.set(name, instance);
      return instance;
    } catch (error) {
      console.error('Error creating WhatsApp instance:', error);
      throw new Error('Failed to create WhatsApp instance');
    }
  }

  async deleteInstance(instanceName: string): Promise<void> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      await evolutionApi.deleteInstance(instanceName, instance.apiKey);
      this.instances.delete(instanceName);
    } catch (error) {
      console.error('Error deleting WhatsApp instance:', error);
      throw new Error('Failed to delete WhatsApp instance');
    }
  }

  async connectInstance(instanceName: string): Promise<string | undefined> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      const response = await evolutionApi.connectInstance(instanceName, instance.apiKey);
      
      // Update instance status
      instance.status = 'connecting';
      instance.qrCode = response.base64;
      instance.lastUpdate = new Date().toISOString();
      
      this.instances.set(instanceName, instance);
      return response.base64;
    } catch (error) {
      console.error('Error connecting WhatsApp instance:', error);
      throw new Error('Failed to connect WhatsApp instance');
    }
  }

  async logoutInstance(instanceName: string): Promise<void> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      await evolutionApi.logoutInstance(instanceName, instance.apiKey);
      
      // Update instance status
      instance.status = 'disconnected';
      instance.qrCode = undefined;
      instance.lastUpdate = new Date().toISOString();
      
      this.instances.set(instanceName, instance);
    } catch (error) {
      console.error('Error logging out WhatsApp instance:', error);
      throw new Error('Failed to logout WhatsApp instance');
    }
  }

  async checkConnectionState(instanceName: string): Promise<string> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      const response = await evolutionApi.getConnectionState(instanceName, instance.apiKey);
      
      // Update instance status based on connection state
      const newStatus = response.state === 'open' ? 'connected' : 
                       response.state === 'connecting' ? 'connecting' : 'disconnected';
      
      instance.status = newStatus;
      instance.lastUpdate = new Date().toISOString();
      
      this.instances.set(instanceName, instance);
      return response.state;
    } catch (error) {
      console.error('Error checking connection state:', error);
      throw new Error('Failed to check connection state');
    }
  }

  // Message Operations
  async sendTextMessage(request: SendMessageRequest): Promise<WhatsAppMessage> {
    const instance = this.instances.get(request.instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    if (instance.status !== 'connected') {
      throw new Error('Instance is not connected');
    }

    try {
      const response = await evolutionApi.sendTextMessage(
        request.instanceName,
        instance.apiKey,
        {
          number: request.phoneNumber,
          textMessage: {
            text: request.message,
          },
          options: {
            delay: 1000,
            presence: 'composing',
          },
        }
      );

      const message: WhatsAppMessage = {
        id: response.key.id,
        instanceName: request.instanceName,
        remoteJid: request.phoneNumber,
        fromMe: true,
        messageType: 'text',
        content: request.message,
        timestamp: Date.now(),
        status: 'sent',
      };

      return message;
    } catch (error) {
      console.error('Error sending text message:', error);
      throw new Error('Failed to send text message');
    }
  }

  async sendMediaMessage(request: SendMessageRequest): Promise<WhatsAppMessage> {
    const instance = this.instances.get(request.instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    if (instance.status !== 'connected') {
      throw new Error('Instance is not connected');
    }

    if (!request.mediaUrl || !request.mediaType) {
      throw new Error('Media URL and type are required for media messages');
    }

    try {
      const response = await evolutionApi.sendMediaMessage(
        request.instanceName,
        instance.apiKey,
        {
          number: request.phoneNumber,
          mediaMessage: {
            mediatype: request.mediaType,
            media: request.mediaUrl,
            caption: request.caption,
            fileName: request.fileName,
          },
          options: {
            delay: 1000,
            presence: 'composing',
          },
        }
      );

      const message: WhatsAppMessage = {
        id: response.key.id,
        instanceName: request.instanceName,
        remoteJid: request.phoneNumber,
        fromMe: true,
        messageType: request.mediaType,
        content: request.caption || '',
        timestamp: Date.now(),
        status: 'sent',
        mediaUrl: request.mediaUrl,
        fileName: request.fileName,
      };

      return message;
    } catch (error) {
      console.error('Error sending media message:', error);
      throw new Error('Failed to send media message');
    }
  }

  // Contact and Chat Operations
  async getContacts(instanceName: string): Promise<WhatsAppContact[]> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      const response = await evolutionApi.findContacts(instanceName, instance.apiKey);
      
      return response.map((contact: any) => ({
        jid: contact.id,
        name: contact.name || contact.pushName,
        pushName: contact.pushName,
        isGroup: contact.id.includes('@g.us'),
        profilePicUrl: contact.profilePicUrl,
      }));
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw new Error('Failed to get contacts');
    }
  }

  async getChats(instanceName: string): Promise<WhatsAppChat[]> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      const response = await evolutionApi.findChats(instanceName, instance.apiKey);
      
      return response.map((chat: any) => ({
        id: chat.id,
        instanceName,
        remoteJid: chat.id,
        name: chat.name,
        isGroup: chat.id.includes('@g.us'),
        unreadCount: chat.unreadCount || 0,
        archived: chat.archived || false,
        pinned: chat.pinned || false,
      }));
    } catch (error) {
      console.error('Error getting chats:', error);
      throw new Error('Failed to get chats');
    }
  }

  async getChatMessages(instanceName: string, phoneNumber: string, limit = 20): Promise<WhatsAppMessage[]> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      const response = await evolutionApi.findMessages(instanceName, instance.apiKey, phoneNumber, limit);
      
      return response.map((msg: any) => ({
        id: msg.key.id,
        instanceName,
        remoteJid: msg.key.remoteJid,
        fromMe: msg.key.fromMe,
        messageType: msg.messageType || 'text',
        content: this.extractMessageContent(msg.message),
        timestamp: msg.messageTimestamp,
        status: 'delivered',
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw new Error('Failed to get chat messages');
    }
  }

  // Webhook Handling
  async setWebhook(instanceName: string, webhookUrl: string): Promise<void> {
    const instance = this.instances.get(instanceName);
    if (!instance) {
      throw new Error('Instance not found');
    }

    try {
      await evolutionApi.setWebhook(instanceName, instance.apiKey, webhookUrl);
      
      // Update instance webhook URL
      instance.webhookUrl = webhookUrl;
      this.instances.set(instanceName, instance);
    } catch (error) {
      console.error('Error setting webhook:', error);
      throw new Error('Failed to set webhook');
    }
  }

  // Utility Methods
  getInstance(instanceName: string): WhatsAppInstance | undefined {
    return this.instances.get(instanceName);
  }

  getAllInstances(): WhatsAppInstance[] {
    return Array.from(this.instances.values());
  }

  private extractMessageContent(message: any): string {
    if (!message) return '';
    
    if (message.conversation) return message.conversation;
    if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
    if (message.imageMessage?.caption) return message.imageMessage.caption;
    if (message.videoMessage?.caption) return message.videoMessage.caption;
    if (message.documentMessage?.caption) return message.documentMessage.caption;
    
    return '';
  }

  // Process webhook events
  processWebhookEvent(event: any): WhatsAppMessage | null {
    try {
      if (event.data && event.data.message) {
        const message: WhatsAppMessage = {
          id: event.data.key.id,
          instanceName: event.instance,
          remoteJid: event.data.key.remoteJid,
          fromMe: event.data.key.fromMe,
          messageType: event.data.messageType || 'text',
          content: this.extractMessageContent(event.data.message),
          timestamp: event.data.messageTimestamp,
          status: 'delivered',
        };

        return message;
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
    }

    return null;
  }
}

export const whatsappService = new WhatsAppService();
export default WhatsAppService;