import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "message" | "user" | "error" | "success";
  title: string;
  description: string;
  timestamp: string;
  status?: "active" | "completed" | "error";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "user",
    title: "Novo cliente",
    description: "Maria Silva cadastrou-se via WhatsApp",
    timestamp: "2 min atrás",
    status: "completed"
  },
  {
    id: "2",
    type: "message",
    title: "Atendimento iniciado",
    description: "Fluxo WhatsApp Lead Capture executado",
    timestamp: "5 min atrás",
    status: "active"
  },
  {
    id: "3",
    type: "error",
    title: "Erro no fluxo",
    description: "Falha na integração com API de pagamento",
    timestamp: "12 min atrás",
    status: "error"
  },
  {
    id: "4",
    type: "success",
    title: "FAQ atualizado",
    description: "Novos prompts adicionados para suporte",
    timestamp: "1 hora atrás",
    status: "completed"
  },
  {
    id: "5",
    type: "message",
    title: "Mensagem recebida",
    description: "Cliente João aguarda resposta há 15 min",
    timestamp: "1 hora atrás",
    status: "active"
  }
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "user":
      return UserPlus;
    case "message":
      return MessageSquare;
    case "error":
      return AlertTriangle;
    case "success":
      return CheckCircle;
    default:
      return Clock;
  }
};

const getActivityColor = (status: Activity["status"]) => {
  switch (status) {
    case "active":
      return "bg-primary/10 text-primary border-primary/20";
    case "completed":
      return "bg-success/10 text-success border-success/20";
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Atividade Recente
        </CardTitle>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  getActivityColor(activity.status)
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}