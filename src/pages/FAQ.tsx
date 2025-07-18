import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Save,
  RotateCcw,
  Plus,
  MessageSquare,
  Facebook,
  Instagram,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar
} from "lucide-react";

const channels = [
  { id: "whatsapp", name: "WhatsApp", icon: MessageSquare },
  { id: "facebook", name: "Facebook Messenger", icon: Facebook },
  { id: "instagram", name: "Instagram DM", icon: Instagram },
  { id: "email", name: "E-mail", icon: Mail },
];

const variables = [
  { name: "[NOME]", description: "Nome do cliente" },
  { name: "[EMAIL]", description: "E-mail do cliente" },
  { name: "[EMPRESA]", description: "Nome da empresa" },
  { name: "[DATA]", description: "Data atual" },
  { name: "[HORA]", description: "Hora atual" },
  { name: "[AGENTE]", description: "Nome do agente" },
];

const recentChanges = [
  {
    id: "1",
    user: "João Silva",
    action: "Adicionou novo prompt para WhatsApp",
    timestamp: "2 horas atrás",
    type: "create"
  },
  {
    id: "2", 
    user: "Maria Costa",
    action: "Editou resposta de FAQ sobre pagamentos",
    timestamp: "1 dia atrás",
    type: "edit"
  },
  {
    id: "3",
    user: "Pedro Santos",
    action: "Sincronizou com Google Docs",
    timestamp: "2 dias atrás",
    type: "sync"
  }
];

export default function FAQ() {
  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [content, setContent] = useState(`Olá [NOME]! 👋

Bem-vindo ao nosso atendimento via WhatsApp.

Como posso ajudá-lo hoje?

Opções disponíveis:
1️⃣ Informações sobre produtos
2️⃣ Suporte técnico  
3️⃣ Financeiro
4️⃣ Falar com atendente

Digite o número da opção desejada.`);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ & Prompts</h1>
          <p className="text-muted-foreground">
            Gerencie mensagens automáticas e respostas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Seção
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Channel Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Editor de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeChannel} onValueChange={setActiveChannel}>
                <TabsList className="grid w-full grid-cols-4">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <TabsTrigger key={channel.id} value={channel.id}>
                        <Icon className="h-4 w-4 mr-2" />
                        {channel.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {channels.map((channel) => (
                  <TabsContent key={channel.id} value={channel.id} className="mt-4">
                    <div className="space-y-4">
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Digite o conteúdo para ${channel.name}...`}
                        className="min-h-[300px]"
                      />
                      <div className="flex justify-end">
                        <Button>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de Alterações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentChanges.map((change) => (
                  <div key={change.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{change.user}</p>
                      <p className="text-sm text-muted-foreground">{change.action}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {change.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status da Sincronização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Google Docs</span>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  Sincronizado
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Última atualização: Hoje às 14:32
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm">n8n Workflow</span>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  Pendente
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Última tentativa: 1 hora atrás
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mensagens enviadas</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de resposta</span>
                <span className="text-sm font-medium">87.3%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Última atualização: 15 min atrás
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variáveis Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {variables.map((variable) => (
                  <div key={variable.name} className="p-2 rounded border">
                    <div className="font-mono text-sm font-medium">
                      {variable.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {variable.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}