import { useState, useCallback } from 'react';
import { evolutionApi, CreateInstanceRequest, SendTextMessageRequest, SendMediaMessageRequest } from '@/services/evolutionApi';
import { toast } from 'sonner';

interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  apiKey: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_code';
  qrCode?: string;
  lastUpdate: string;
}

export function useEvolutionApi() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(false);

  // Create new WhatsApp instance
  const createInstance = useCallback(async (instanceName: string, webhookUrl?: string) => {
    setLoading(true);
    try {
      const requestData: CreateInstanceRequest = {
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        webhookUrl,
        webhookByEvents: true,
        webhookBase64: false,
      };

      const response = await evolutionApi.createInstance(requestData);
      
      const newInstance: WhatsAppInstance = {
        instanceName: response.instance.instanceName,
        instanceId: response.instance.instanceId,
        apiKey: response.hash.apikey,
        status: 'qr_code',
        qrCode: response.qrcode?.base64,
        lastUpdate: new Date().toISOString(),
      };

      setInstances(prev => [...prev, newInstance]);
      
      // Set webhook if provided
      if (webhookUrl) {
        await evolutionApi.setWebhook(instanceName, response.hash.apikey, webhookUrl);
      }

      toast.success('Instância criada com sucesso!');
      return newInstance;
    } catch (error) {
      console.error('Error creating instance:', error);
      toast.error('Erro ao criar instância do WhatsApp');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete instance
  const deleteInstance = useCallback(async (instanceName: string, apiKey: string) => {
    setLoading(true);
    try {
      await evolutionApi.deleteInstance(instanceName, apiKey);
      setInstances(prev => prev.filter(instance => instance.instanceName !== instanceName));
      toast.success('Instância removida com sucesso!');
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast.error('Erro ao remover instância');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect/reconnect instance
  const connectInstance = useCallback(async (instanceName: string, apiKey: string) => {
    setLoading(true);
    try {
      const response = await evolutionApi.connectInstance(instanceName, apiKey);
      
      setInstances(prev => prev.map(instance => 
        instance.instanceName === instanceName 
          ? { 
              ...instance, 
              status: 'connecting', 
              qrCode: response.base64,
              lastUpdate: new Date().toISOString() 
            }
          : instance
      ));

      return response;
    } catch (error) {
      console.error('Error connecting instance:', error);
      toast.error('Erro ao conectar instância');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout instance
  const logoutInstance = useCallback(async (instanceName: string, apiKey: string) => {
    setLoading(true);
    try {
      await evolutionApi.logoutInstance(instanceName, apiKey);
      
      setInstances(prev => prev.map(instance => 
        instance.instanceName === instanceName 
          ? { 
              ...instance, 
              status: 'disconnected',
              qrCode: undefined,
              lastUpdate: new Date().toISOString() 
            }
          : instance
      ));

      toast.success('Desconectado com sucesso!');
    } catch (error) {
      console.error('Error logging out instance:', error);
      toast.error('Erro ao desconectar instância');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check connection state
  const checkConnectionState = useCallback(async (instanceName: string, apiKey: string) => {
    try {
      const response = await evolutionApi.getConnectionState(instanceName, apiKey);
      
      setInstances(prev => prev.map(instance => 
        instance.instanceName === instanceName 
          ? { 
              ...instance, 
              status: response.state === 'open' ? 'connected' : 'disconnected',
              lastUpdate: new Date().toISOString() 
            }
          : instance
      ));

      return response;
    } catch (error) {
      console.error('Error checking connection state:', error);
      return null;
    }
  }, []);

  // Send text message
  const sendTextMessage = useCallback(async (
    instanceName: string, 
    apiKey: string, 
    phoneNumber: string, 
    message: string
  ) => {
    setLoading(true);
    try {
      const requestData: SendTextMessageRequest = {
        number: phoneNumber,
        textMessage: {
          text: message,
        },
        options: {
          delay: 1000,
          presence: 'composing',
        },
      };

      const response = await evolutionApi.sendTextMessage(instanceName, apiKey, requestData);
      toast.success('Mensagem enviada com sucesso!');
      return response;
    } catch (error) {
      console.error('Error sending text message:', error);
      toast.error('Erro ao enviar mensagem');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send media message
  const sendMediaMessage = useCallback(async (
    instanceName: string,
    apiKey: string,
    phoneNumber: string,
    mediaUrl: string,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    caption?: string,
    fileName?: string
  ) => {
    setLoading(true);
    try {
      const requestData: SendMediaMessageRequest = {
        number: phoneNumber,
        mediaMessage: {
          mediatype: mediaType,
          media: mediaUrl,
          caption,
          fileName,
        },
        options: {
          delay: 1000,
          presence: 'composing',
        },
      };

      const response = await evolutionApi.sendMediaMessage(instanceName, apiKey, requestData);
      toast.success('Mídia enviada com sucesso!');
      return response;
    } catch (error) {
      console.error('Error sending media message:', error);
      toast.error('Erro ao enviar mídia');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all instances
  const fetchInstances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await evolutionApi.fetchInstances();
      // Transform response to match our interface
      const transformedInstances: WhatsAppInstance[] = response.map((instance: any) => ({
        instanceName: instance.instanceName || instance.instance,
        instanceId: instance.instanceId || instance.instance,
        apiKey: instance.apikey || '',
        status: instance.connectionStatus === 'open' ? 'connected' : 'disconnected',
        lastUpdate: new Date().toISOString(),
      }));
      
      setInstances(transformedInstances);
      return transformedInstances;
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast.error('Erro ao buscar instâncias');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Set webhook for instance
  const setWebhook = useCallback(async (
    instanceName: string, 
    apiKey: string, 
    webhookUrl: string
  ) => {
    setLoading(true);
    try {
      const response = await evolutionApi.setWebhook(instanceName, apiKey, webhookUrl);
      toast.success('Webhook configurado com sucesso!');
      return response;
    } catch (error) {
      console.error('Error setting webhook:', error);
      toast.error('Erro ao configurar webhook');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    instances,
    loading,
    createInstance,
    deleteInstance,
    connectInstance,
    logoutInstance,
    checkConnectionState,
    sendTextMessage,
    sendMediaMessage,
    fetchInstances,
    setWebhook,
  };
}