import { Input } from "@/components/ui/input";
import { Search, Users, MessageSquare, BarChart3, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { ActivityFeed } from "@/components/activity-feed";
import { QuickActions } from "@/components/quick-actions";
import { ActiveFlows } from "@/components/active-flows";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu atendimento
          </p>
        </div>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes, atendimentos..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Clientes"
          value="2,543"
          description="Clientes ativos"
          icon={Users}
          trend={{
            value: 12.5,
            label: "vs mês anterior"
          }}
        />
        <MetricCard
          title="Atendimentos Ativos"
          value="127"
          description="Em andamento"
          icon={MessageSquare}
          trend={{
            value: -2.3,
            label: "vs semana anterior"
          }}
        />
        <MetricCard
          title="Mensagens Processadas"
          value="15,382"
          description="Hoje"
          icon={BarChart3}
          trend={{
            value: 8.7,
            label: "vs ontem"
          }}
        />
        <MetricCard
          title="Taxa de Sucesso"
          value="96.4%"
          description="Resolução automática"
          icon={TrendingUp}
          trend={{
            value: 1.2,
            label: "vs mês anterior"
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>

      {/* Active Flows */}
      <ActiveFlows />
    </div>
  );
}