import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface Connection {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "pending";
  session: string;
  lastUpdate: string;
  default: boolean;
}

const mockConnections: Connection[] = [
  {
    id: "1",
    name: "Diego1",
    status: "connected",
    session: "DESCONECTAR",
    lastUpdate: "18/07/25 22:05",
    default: true
  }
];

export default function Connections() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    greetingMessage: "",
    farewellMessage: "",
    outOfHoursMessage: "",
    evaluationMessage: "",
    token: "",
    queue: "",
    prompt: "",
    integrations: "",
    transferAfter: "0",
    transferQueue: "",
    inactivityMessage: ""
  });

  const handleNewConnection = () => {
    setEditingConnection(null);
    setFormData({
      name: "",
      greetingMessage: "",
      farewellMessage: "",
      outOfHoursMessage: "",
      evaluationMessage: "",
      token: "",
      queue: "",
      prompt: "",
      integrations: "",
      transferAfter: "0",
      transferQueue: "",
      inactivityMessage: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setFormData({
      name: connection.name,
      greetingMessage: "",
      farewellMessage: "",
      outOfHoursMessage: "",
      evaluationMessage: "",
      token: "",
      queue: "",
      prompt: "",
      integrations: "",
      transferAfter: "0",
      transferQueue: "",
      inactivityMessage: ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveConnection = () => {
    console.log("Salvando conexão:", formData);
    setIsDialogOpen(false);
    setEditingConnection(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    console.log("Deletando conexão:", connectionId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success/10 text-success border-success/20"><CheckCircle className="h-3 w-3 mr-1" />Conectado</Badge>;
      case "disconnected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" />Desconectado</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20"><RefreshCw className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conexões</h1>
          <p className="text-muted-foreground">
            Gerencie as conexões WhatsApp do sistema
          </p>
        </div>
        <Button onClick={handleNewConnection}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar WhatsApp
        </Button>
      </div>

      {/* Connections Table */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
            <div>Nome</div>
            <div className="text-center">Status</div>
            <div className="text-center">Sessão</div>
            <div className="text-center">Última atualização</div>
            <div className="text-center">Padrão</div>
            <div className="text-right">Ações</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockConnections.map((connection) => (
            <div key={connection.id} className="grid grid-cols-6 gap-4 items-center py-3 border-b border-border/50 last:border-b-0">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{connection.name}</span>
              </div>
              
              <div className="text-center">
                {getStatusBadge(connection.status)}
              </div>
              
              <div className="text-center">
                <Button variant="outline" size="sm" className="text-xs">
                  {connection.session}
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                {connection.lastUpdate}
              </div>
              
              <div className="text-center">
                {connection.default && (
                  <CheckCircle className="h-4 w-4 text-success mx-auto" />
                )}
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditConnection(connection)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteConnection(connection.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {mockConnections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conexão encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConnection ? "Editar WhatsApp" : "Adicionar WhatsApp"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome é obrigatório"
                />
              </div>
              <div className="space-y-2">
                <Label>Padrão</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="default" className="rounded" />
                  <Label htmlFor="default" className="text-sm">Definir como padrão</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="greetingMessage">Mensagem de saudação</Label>
                <Textarea
                  id="greetingMessage"
                  value={formData.greetingMessage}
                  onChange={(e) => setFormData({...formData, greetingMessage: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farewellMessage">Mensagem de conclusão</Label>
                <Textarea
                  id="farewellMessage"
                  value={formData.farewellMessage}
                  onChange={(e) => setFormData({...formData, farewellMessage: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outOfHoursMessage">Mensagem de fora de expediente</Label>
                <Textarea
                  id="outOfHoursMessage"
                  value={formData.outOfHoursMessage}
                  onChange={(e) => setFormData({...formData, outOfHoursMessage: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluationMessage">Mensagem de avaliação</Label>
                <Textarea
                  id="evaluationMessage"
                  value={formData.evaluationMessage}
                  onChange={(e) => setFormData({...formData, evaluationMessage: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  placeholder="Token"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="queue">Filas</Label>
                  <Select value={formData.queue} onValueChange={(value) => setFormData({...formData, queue: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fila" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Suporte</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Select value={formData.prompt} onValueChange={(value) => setFormData({...formData, prompt: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Padrão</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="support">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="integrations">Integrações</Label>
                <Select value={formData.integrations} onValueChange={(value) => setFormData({...formData, integrations: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma integração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="n8n">n8n</SelectItem>
                    <SelectItem value="zapier">Zapier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-4">Redirecionamento de Fila</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Selecione uma fila para os contatos que não possuem fila serem redirecionados
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferAfter">Transferir após x (minutos)</Label>
                    <Input
                      id="transferAfter"
                      type="number"
                      value={formData.transferAfter}
                      onChange={(e) => setFormData({...formData, transferAfter: e.target.value})}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">Encerrar chats abertos após x minutos</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transferQueue">Fila de Transferência</Label>
                    <Select value={formData.transferQueue} onValueChange={(value) => setFormData({...formData, transferQueue: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma fila" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Suporte</SelectItem>
                        <SelectItem value="sales">Vendas</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="inactivityMessage">Mensagem de encerramento por inatividade</Label>
                  <Textarea
                    id="inactivityMessage"
                    value={formData.inactivityMessage}
                    onChange={(e) => setFormData({...formData, inactivityMessage: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveConnection}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}