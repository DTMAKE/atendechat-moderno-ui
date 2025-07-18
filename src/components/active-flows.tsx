import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Facebook,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Flow {
  id: string;
  name: string;
  platform: "whatsapp" | "facebook" | "email";
  status: "active" | "paused" | "error";
  successCount: number;
  errorCount: number;
  lastActivity: string;
}

const flows: Flow[] = [
  {
    id: "1",
    name: "WhatsApp Lead Capture",
    platform: "whatsapp",
    status: "active",
    successCount: 847,
    errorCount: 12,
    lastActivity: "2 min atrás"
  },
  {
    id: "2", 
    name: "Facebook Messenger",
    platform: "facebook",
    status: "paused",
    successCount: 234,
    errorCount: 5,
    lastActivity: "1 hora atrás"
  },
  {
    id: "3",
    name: "Email Marketing",
    platform: "email", 
    status: "active",
    successCount: 1532,
    errorCount: 8,
    lastActivity: "5 min atrás"
  }
];

const getPlatformIcon = (platform: Flow["platform"]) => {
  switch (platform) {
    case "whatsapp":
      return MessageSquare;
    case "facebook":
      return Facebook;
    case "email":
      return Mail;
    default:
      return MessageSquare;
  }
};

const getStatusBadge = (status: Flow["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
    case "paused":
      return <Badge variant="secondary">Pausado</Badge>;
    case "error":
      return <Badge variant="destructive">Erro</Badge>;
    default:
      return <Badge variant="secondary">Desconhecido</Badge>;
  }
};

export function ActiveFlows() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Fluxos Ativos
        </CardTitle>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Gerenciar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flows.map((flow) => {
            const PlatformIcon = getPlatformIcon(flow.platform);
            return (
              <div key={flow.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <PlatformIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{flow.name}</p>
                      {getStatusBadge(flow.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-xs text-muted-foreground">
                          {flow.successCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-muted-foreground">
                          {flow.errorCount}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {flow.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {flow.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}