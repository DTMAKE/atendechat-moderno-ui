import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Webhook {
  id: string;
  name: string;
  url: string;
  type: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastTriggered?: string;
}

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    name: "Chat IA Suporte",
    url: "https://n8n.exemplo.com/webhook/chat-ia",
    type: "chat_ai",
    status: "active",
    createdAt: "2024-01-10",
    lastTriggered: "2024-01-15 14:30"
  },
  {
    id: "2", 
    name: "Registro de Usuários",
    url: "https://n8n.exemplo.com/webhook/user-register",
    type: "user_registration",
    status: "active",
    createdAt: "2024-01-12",
    lastTriggered: "2024-01-14 10:15"
  },
  {
    id: "3",
    name: "Notificações Ticket",
    url: "https://n8n.exemplo.com/webhook/ticket-notifications",
    type: "ticket_notification",
    status: "inactive",
    createdAt: "2024-01-08"
  }
];

const webhookTypes = [
  { value: "chat_ai", label: "Chat IA" },
  { value: "user_registration", label: "Registro de Usuários" },
  { value: "ticket_notification", label: "Notificações de Ticket" },
  { value: "message_received", label: "Mensagem Recebida" },
  { value: "custom", label: "Personalizado" }
];

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    type: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!formData.name || !formData.url || !formData.type) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      type: formData.type,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWebhooks([...webhooks, newWebhook]);
    setFormData({ name: "", url: "", type: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Webhook adicionado com sucesso!"
    });
  };

  const handleEdit = () => {
    if (!editingWebhook || !formData.name || !formData.url || !formData.type) {
      toast({
        title: "Erro", 
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setWebhooks(webhooks.map(webhook => 
      webhook.id === editingWebhook.id
        ? { ...webhook, name: formData.name, url: formData.url, type: formData.type }
        : webhook
    ));

    setEditingWebhook(null);
    setFormData({ name: "", url: "", type: "" });
    setIsEditDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Webhook atualizado com sucesso!"
    });
  };

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast({
      title: "Sucesso",
      description: "Webhook removido com sucesso!"
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência"
    });
  };

  const openEditDialog = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      type: webhook.type
    });
    setIsEditDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    return webhookTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Webhooks</h1>
          <p className="text-muted-foreground">
            Gerencie as integrações via webhooks do sistema
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  placeholder="Nome do webhook"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  placeholder="https://exemplo.com/webhook"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhookTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAdd} className="flex-1">
                  Adicionar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Último Disparo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(webhook.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="truncate text-sm">{webhook.url}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(webhook.url)}
                        className="p-1 h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={webhook.status === 'active' ? 'default' : 'secondary'}
                      className={webhook.status === 'active' ? 'bg-green-500' : ''}
                    >
                      {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{webhook.createdAt}</TableCell>
                  <TableCell>{webhook.lastTriggered || 'Nunca'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(webhook)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(webhook.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(webhook.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                placeholder="Nome do webhook"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-url">URL *</Label>
              <Input
                id="edit-url"
                placeholder="https://exemplo.com/webhook"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {webhookTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}