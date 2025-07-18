import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  UserPlus, 
  Download, 
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  source: "whatsapp" | "facebook" | "website";
  createdAt: string;
  lastInteraction: string;
}

const clients: Client[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    status: "active",
    source: "whatsapp",
    createdAt: "15/01/2024",
    lastInteraction: "Hoje às 14:32"
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com", 
    phone: "(11) 88888-8888",
    status: "pending",
    source: "facebook",
    createdAt: "14/01/2024",
    lastInteraction: "Ontem às 16:45"
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 77777-7777",
    status: "active",
    source: "website",
    createdAt: "13/01/2024",
    lastInteraction: "Hoje às 09:15"
  },
  {
    id: "4",
    name: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 66666-6666",
    status: "inactive",
    source: "whatsapp",
    createdAt: "12/01/2024",
    lastInteraction: "3 dias atrás"
  }
];

const getStatusBadge = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inativo</Badge>;
  }
};

const getSourceBadge = (source: Client["source"]) => {
  switch (source) {
    case "whatsapp":
      return <Badge variant="outline">WhatsApp</Badge>;
    case "facebook":
      return <Badge variant="outline">Facebook</Badge>;
    case "website":
      return <Badge variant="outline">Website</Badge>;
  }
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Client["status"]>("all");

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === "active").length;
  const pendingClients = clients.filter(c => c.status === "pending").length;
  const inactiveClients = clients.filter(c => c.status === "inactive").length;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Clientes"
          value={totalClients.toString()}
          icon={Users}
        />
        <MetricCard
          title="Clientes Ativos"
          value={activeClients.toString()}
          icon={UserCheck}
          className="border-success/20"
        />
        <MetricCard
          title="Pendentes"
          value={pendingClients.toString()}
          icon={Clock}
          className="border-warning/20"
        />
        <MetricCard
          title="Inativos"
          value={inactiveClients.toString()}
          icon={UserX}
          className="border-muted/20"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Clientes</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {statusFilter === "all" ? "Todos" : 
                     statusFilter === "active" ? "Ativos" :
                     statusFilter === "pending" ? "Pendentes" : "Inativos"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Ativos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    Pendentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    Inativos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {client.phone}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell>
                    {getSourceBadge(client.source)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {client.createdAt}
                  </TableCell>
                  <TableCell className="text-sm">
                    {client.lastInteraction}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Novo atendimento</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}