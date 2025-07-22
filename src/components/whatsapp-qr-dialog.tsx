import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceName: string;
  qrCode?: string;
  onRefreshQR: () => Promise<void>;
  onCheckConnection: () => Promise<any>;
}

export function WhatsAppQRDialog({
  open,
  onOpenChange,
  instanceName,
  qrCode,
  onRefreshQR,
  onCheckConnection,
}: WhatsAppQRDialogProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'connected' | 'error'>('pending');
  const [autoCheckInterval, setAutoCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto check connection every 5 seconds
  useEffect(() => {
    if (open && connectionStatus === 'pending') {
      const interval = setInterval(async () => {
        try {
          const state = await onCheckConnection();
          if (state?.state === 'open') {
            setConnectionStatus('connected');
            toast.success('WhatsApp conectado com sucesso!');
            setTimeout(() => onOpenChange(false), 2000);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }, 5000);

      setAutoCheckInterval(interval);
      return () => clearInterval(interval);
    }

    if (autoCheckInterval) {
      clearInterval(autoCheckInterval);
      setAutoCheckInterval(null);
    }
  }, [open, connectionStatus, onCheckConnection, onOpenChange]);

  // Reset status when dialog opens
  useEffect(() => {
    if (open) {
      setConnectionStatus('pending');
    }
  }, [open]);

  const handleRefreshQR = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshQR();
      setConnectionStatus('pending');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Erro ao atualizar QR Code');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualCheck = async () => {
    try {
      const state = await onCheckConnection();
      if (state?.state === 'open') {
        setConnectionStatus('connected');
        toast.success('WhatsApp conectado com sucesso!');
        setTimeout(() => onOpenChange(false), 2000);
      } else {
        toast.info('WhatsApp ainda não foi conectado');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Erro ao verificar conexão');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code com o seu WhatsApp para conectar a instância "{instanceName}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {connectionStatus === 'connected' ? (
            <div className="flex flex-col items-center space-y-4 p-8">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-700">
                  Conectado com sucesso!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sua instância do WhatsApp está ativa e funcionando.
                </p>
              </div>
            </div>
          ) : connectionStatus === 'error' ? (
            <div className="flex flex-col items-center space-y-4 p-8">
              <XCircle className="h-16 w-16 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700">
                  Erro na conexão
                </h3>
                <p className="text-sm text-muted-foreground">
                  Houve um problema ao conectar o WhatsApp. Tente novamente.
                </p>
              </div>
            </div>
          ) : (
            <>
              {qrCode ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="border border-border rounded-lg p-4 bg-white">
                    <img 
                      src={qrCode} 
                      alt="QR Code WhatsApp" 
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Abra o WhatsApp no seu celular, vá em Dispositivos vinculados e escaneie este código.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Gerando QR Code...
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {connectionStatus !== 'connected' && (
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleRefreshQR} 
              disabled={isRefreshing}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar QR Code'}
            </Button>
            
            <Button 
              onClick={handleManualCheck}
              variant="default"
              className="w-full"
            >
              Verificar Conexão
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}