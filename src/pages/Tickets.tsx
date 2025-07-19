import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  User,
  MessageSquare,
  Eye
} from "lucide-react";

interface Ticket {
  id: string;
  number: string;
  client: string;
  phone: string;
  subject: string;
  status: "open" | "waiting" | "progress" | "finished";
  priority: "low" | "medium" | "high";
  agent?: string;
  created: string;
  updated: string;
  tags: string[];
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    number: "553",
    client: "Daiana Rodrigues",
    phone: "5521975933260",
    subject: "Suporte técnico",
    status: "finished",
    priority: "medium",
    agent: "João Silva",
    created: "2 horas atrás",
    updated: "1 hora atrás",
    tags: ["SUPORTE", "URGENTE"],
    messages: 8
  },
  {
    id: "2",
    number: "1149",
    client: "Rodrigo R",
    phone: "553491753111",
    subject: "Dúvida sobre produto",
    status: "progress",
    priority: "low",
    agent: "Maria Santos",
    created: "3 horas atrás",
    updated: "30 min atrás",
    tags: ["VENDAS"],
    messages: 5
  },
  {
    id: "3",
    number: "512",
    client: "PAPO RETO - ELITE",
    phone: "120363260323910075",
    subject: "Reclamação",
    status: "progress",
    priority: "high",
    created: "4 horas atrás",
    updated: "2 horas atrás",
    tags: ["RECLAMACAO", "VIP"],
    messages: 12
  },
  {
    id: "4",
    number: "1044",
    client: "Pack supremo",
    phone: "551151985970",
    subject: "Nova venda",
    status: "open",
    priority: "medium",
    created: "5 horas atrás",
    updated: "5 horas atrás",
    tags: ["VENDAS"],
    messages: 2
  }
];

const statusConfig = {
  open: { label: "Em Aberto", color: "bg-blue-500", count: 172 },
  waiting: { label: "Esperando", color: "bg-yellow-500", count: 0 },
  progress: { label: "Andamento", color: "bg-orange-500", count: 0 },
  finished: { label: "Finalizados", color: "bg-green-500", count: 0 }
};

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  high: "bg-red-100 text-red-800 border-red-200"
};

export default function Tickets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQueue, setSelectedQueue] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.phone.includes(searchTerm) ||
                         ticket.number.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getTicketsByStatus = (status: string) => {
    return filteredTickets.filter(ticket => ticket.status === status);
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{ticket.client}</span>
              <Badge variant="outline" className="text-xs">#{ticket.number}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{ticket.phone}</p>
            <p className="text-sm text-foreground mb-2">{ticket.subject}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {ticket.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{ticket.created}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{ticket.messages}</span>
            </div>
          </div>
          {ticket.agent && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.agent}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Badge className={`text-xs ${priorityColors[ticket.priority]}`}>
            {ticket.priority === "high" ? "Alta" : ticket.priority === "medium" ? "Média" : "Baixa"}
          </Badge>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
            onClick={() => navigate(`/ticket/${ticket.id}`)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atendimentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os tickets de atendimento
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedQueue} onValueChange={setSelectedQueue}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todas as filas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as filas</SelectItem>
            <SelectItem value="support">Suporte</SelectItem>
            <SelectItem value="sales">Vendas</SelectItem>
            <SelectItem value="financial">Financeiro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="open">Em Aberto</SelectItem>
            <SelectItem value="waiting">Esperando</SelectItem>
            <SelectItem value="progress">Andamento</SelectItem>
            <SelectItem value="finished">Finalizados</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const tickets = getTicketsByStatus(status);
          return (
            <div key={status} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {tickets.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <div className="space-y-3 min-h-[400px]">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum ticket nesta coluna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}