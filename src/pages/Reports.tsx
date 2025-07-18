import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Clock,
  CheckCircle,
  Download,
  Calendar
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";

const chartData = [
  { month: "Jan", atendimentos: 245, resolvidos: 230 },
  { month: "Fev", atendimentos: 289, resolvidos: 275 },
  { month: "Mar", atendimentos: 312, resolvidos: 298 },
  { month: "Abr", atendimentos: 356, resolvidos: 342 },
  { month: "Mai", atendimentos: 398, resolvidos: 381 },
  { month: "Jun", atendimentos: 445, resolvidos: 430 },
];

export default function Reports() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise de desempenho e métricas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Atendimentos Hoje"
          value="147"
          description="Meta: 150"
          icon={MessageSquare}
          trend={{
            value: 12.5,
            label: "vs ontem"
          }}
        />
        <MetricCard
          title="Tempo Médio"
          value="4.2min"
          description="Resposta"
          icon={Clock}
          trend={{
            value: -8.3,
            label: "vs semana anterior"
          }}
        />
        <MetricCard
          title="Taxa de Resolução"
          value="94.8%"
          description="Primeiro contato"
          icon={CheckCircle}
          trend={{
            value: 2.1,
            label: "vs mês anterior"
          }}
        />
        <MetricCard
          title="Satisfação"
          value="4.7/5"
          description="Avaliação média"
          icon={TrendingUp}
          trend={{
            value: 0.3,
            label: "vs mês anterior"
          }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Atendimentos por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atendimentos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-sm text-muted-foreground">
                      {data.month}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(data.atendimentos / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium w-16 text-right">
                    {data.atendimentos}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance por Canal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">1,247 atendimentos</div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  97.2%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <div>
                    <div className="font-medium">Facebook</div>
                    <div className="text-sm text-muted-foreground">543 atendimentos</div>
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  89.4%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <div>
                    <div className="font-medium">Website</div>
                    <div className="text-sm text-muted-foreground">234 atendimentos</div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  95.1%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Pico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { hour: "09:00", count: 45, percentage: 90 },
                { hour: "14:00", count: 52, percentage: 100 },
                { hour: "16:00", count: 38, percentage: 75 },
                { hour: "19:00", count: 41, percentage: 82 },
                { hour: "21:00", count: 29, percentage: 58 },
              ].map((data) => (
                <div key={data.hour} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-muted-foreground">
                    {data.hour}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium w-8 text-right">
                    {data.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Agentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Agentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Ana Silva", count: 89, satisfaction: 4.9 },
                { name: "João Santos", count: 76, satisfaction: 4.7 },
                { name: "Maria Costa", count: 71, satisfaction: 4.8 },
                { name: "Pedro Lima", count: 68, satisfaction: 4.6 },
                { name: "Carla Souza", count: 62, satisfaction: 4.9 },
              ].map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {agent.count} atendimentos
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    ⭐ {agent.satisfaction}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}