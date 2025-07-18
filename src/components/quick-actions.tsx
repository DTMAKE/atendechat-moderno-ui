import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  MessageSquarePlus, 
  BarChart3, 
  Settings,
  FileText,
  Headphones
} from "lucide-react";

const actions = [
  {
    id: "new-client",
    title: "Novo Cliente",
    description: "Cadastrar novo cliente",
    icon: UserPlus,
    color: "bg-primary hover:bg-primary-hover"
  },
  {
    id: "new-ticket",
    title: "Novo Atendimento",
    description: "Iniciar novo ticket",
    icon: Headphones,
    color: "bg-accent hover:bg-accent/90"
  },
  {
    id: "edit-faq",
    title: "Editar FAQ",
    description: "Gerenciar prompts",
    icon: MessageSquarePlus,
    color: "bg-secondary hover:bg-secondary-hover"
  },
  {
    id: "view-reports",
    title: "Relatórios",
    description: "Ver métricas",
    icon: BarChart3,
    color: "bg-warning hover:bg-warning/90"
  }
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
              >
                <Icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}