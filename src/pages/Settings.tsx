import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Webhook,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  User,
  Building
} from "lucide-react";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://your-n8n-webhook.com/webhook");
  const [settings, setSettings] = useState({
    notifications: {
      newTickets: true,
      systemAlerts: true,
      dailyReports: false,
      weeklyReports: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
      passwordExpiry: 90
    },
    general: {
      companyName: "Sua Empresa",
      timezone: "America/Sao_Paulo",
      language: "pt-BR",
      workingHours: "09:00-18:00"
    }
  });

  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate save
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  const testWebhook = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: "crm_settings"
        }),
      });

      if (response.ok) {
        toast({
          title: "Webhook testado com sucesso",
          description: "A conexão com o n8n está funcionando.",
        });
      } else {
        throw new Error("Erro na conexão");
      }
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Não foi possível conectar ao webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input
                    id="company"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, companyName: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, timezone: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input
                    id="language"
                    value={settings.general.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, language: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Horário de Funcionamento</Label>
                  <Input
                    id="hours"
                    value={settings.general.workingHours}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, workingHours: e.target.value }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Banco de Dados</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Online
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">WhatsApp API</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Conectado
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm">Facebook API</span>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Atenção
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">n8n Webhook</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Ativo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-tickets">Novos Atendimentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificação quando um novo ticket for criado
                  </p>
                </div>
                <Switch
                  id="new-tickets"
                  checked={settings.notifications.newTickets}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, newTickets: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-alerts">Alertas do Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações sobre erros e problemas do sistema
                  </p>
                </div>
                <Switch
                  id="system-alerts"
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, systemAlerts: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-reports">Relatórios Diários</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber resumo diário de atendimentos
                  </p>
                </div>
                <Switch
                  id="daily-reports"
                  checked={settings.notifications.dailyReports}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, dailyReports: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber resumo semanal de métricas
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, weeklyReports: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicionar uma camada extra de segurança
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactor}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFactor: checked }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry">Expiração de Senha (dias)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Integrações n8n
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook n8n</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/..."
                  />
                  <Button onClick={testWebhook} disabled={isLoading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Testar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Este webhook será usado para registros de usuários e chat com IA
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Configuração do n8n</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Para configurar o webhook no n8n:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Crie um novo workflow no n8n</li>
                  <li>2. Adicione um nó "Webhook"</li>
                  <li>3. Configure o método como POST</li>
                  <li>4. Cole a URL do webhook acima</li>
                  <li>5. Adicione nós para processar os dados</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}