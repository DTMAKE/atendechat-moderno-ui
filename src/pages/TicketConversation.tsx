import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Paperclip, 
  Mic, 
  Send, 
  MoreHorizontal,
  Clock,
  User,
  Tag as TagIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  type: 'incoming' | 'outgoing';
  content: string;
  timestamp: string;
  isFromWhatsApp?: boolean;
}

interface TicketData {
  id: string;
  number: string;
  client: {
    name: string;
    phone: string;
    avatar?: string;
  };
  agent: string;
  status: 'open' | 'in_progress' | 'waiting' | 'closed';
  tags: string[];
  createdAt: string;
  lastActivity: string;
}

const mockTicket: TicketData = {
  id: "1",
  number: "#001234",
  client: {
    name: "João Silva",
    phone: "+55 11 99999-9999"
  },
  agent: "Maria Santos",
  status: "in_progress",
  tags: ["urgente", "vendas"],
  createdAt: "2024-01-15 09:00",
  lastActivity: "2024-01-15 14:30"
};

const mockMessages: Message[] = [
  {
    id: "1",
    type: "incoming",
    content: "Olá, gostaria de saber mais sobre os seus serviços",
    timestamp: "14:25",
    isFromWhatsApp: true
  },
  {
    id: "2",
    type: "outgoing",
    content: "Olá João! Fico feliz em ajudar. Sobre qual serviço você gostaria de saber mais?",
    timestamp: "14:26"
  },
  {
    id: "3",
    type: "incoming",
    content: "Estou interessado no plano premium",
    timestamp: "14:28",
    isFromWhatsApp: true
  },
  {
    id: "4",
    type: "outgoing",
    content: "Perfeito! O plano premium inclui todas as funcionalidades avançadas. Posso te enviar mais detalhes por email?",
    timestamp: "14:30"
  }
];

const statusColors = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500", 
  waiting: "bg-orange-500",
  closed: "bg-green-500"
};

const statusLabels = {
  open: "Em Aberto",
  in_progress: "Em Andamento",
  waiting: "Aguardando",
  closed: "Finalizado"
};

export default function TicketConversation() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [ticket] = useState<TicketData>(mockTicket);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        // Aqui seria implementada a integração com Evolution API
        // Exemplo: await sendTextMessage(instanceName, apiKey, phoneNumber, message);
        console.log("Enviando mensagem via Evolution API:", message);
        
        // Simular envio da mensagem
        const newMessage = {
          id: Date.now().toString(),
          type: "outgoing" as const,
          content: message,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isFromWhatsApp: false
        };

        setMessages([...messages, newMessage]);
        setMessage("");
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tickets")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {ticket.client.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {ticket.client.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className={`${statusColors[ticket.status]} text-white`}
            >
              {statusLabels[ticket.status]}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Transferir Ticket</DropdownMenuItem>
                <DropdownMenuItem>Agendar Mensagem</DropdownMenuItem>
                <DropdownMenuItem>Finalizar Atendimento</DropdownMenuItem>
                <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.type === 'outgoing'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                      {msg.isFromWhatsApp && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          WhatsApp
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar with ticket info */}
        <div className="w-80 border-l border-border bg-card/50">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Informações do Ticket
              </h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Número:</span>
                    <span className="text-sm font-medium">{ticket.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Atendente:</span>
                    <span className="text-sm font-medium">{ticket.agent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Criado em:</span>
                    <span className="text-sm font-medium">{ticket.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Última atividade:</span>
                    <span className="text-sm font-medium">{ticket.lastActivity}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                Adicionar Tag
              </Button>
              <Button className="w-full" variant="outline">
                Transferir Ticket
              </Button>
              <Button className="w-full" variant="destructive">
                Finalizar Atendimento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}