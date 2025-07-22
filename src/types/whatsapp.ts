// Types for WhatsApp Evolution API integration

export interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  apiKey: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_code';
  qrCode?: string;
  lastUpdate: string;
  webhookUrl?: string;
  default?: boolean;
}

export interface WhatsAppMessage {
  id: string;
  instanceName: string;
  remoteJid: string; // phone number with country code
  fromMe: boolean;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker';
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read' | 'error';
  mediaUrl?: string;
  caption?: string;
  fileName?: string;
}

export interface WhatsAppContact {
  jid: string; // phone number with country code
  name?: string;
  pushName?: string;
  isGroup: boolean;
  profilePicUrl?: string;
  lastSeen?: number;
}

export interface WhatsAppChat {
  id: string;
  instanceName: string;
  remoteJid: string;
  name?: string;
  isGroup: boolean;
  unreadCount: number;
  lastMessage?: WhatsAppMessage;
  lastMessageTimestamp?: number;
  archived: boolean;
  pinned: boolean;
}

export interface SendMessageRequest {
  instanceName: string;
  phoneNumber: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  caption?: string;
  fileName?: string;
}

export interface WebhookEvent {
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

export interface ConnectionStatus {
  instance: string;
  state: 'close' | 'connecting' | 'open';
}