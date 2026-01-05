import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Revenue, Stat } from "@shared/schema";
import { Save, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardConfig() {
  const { toast } = useToast();

  const { data: revenue } = useQuery<Revenue[]>({
    queryKey: ["/api/revenue"],
  });

  const { data: stats } = useQuery<Stat[]>({
    queryKey: ["/api/stats"],
  });

  const revenueMutation = useMutation({
    mutationFn: async ({ month, revenue, expenses }: Partial<Revenue>) => {
      const res = await fetch(`/api/revenue/${encodeURIComponent(month!)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revenue, expenses }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/revenue"] });
      toast({ title: "Sucesso", description: "Gráfico atualizado." });
    },
  });

  const statsMutation = useMutation({
    mutationFn: async ({ label, value, change, trend }: Partial<Stat>) => {
      const res = await fetch(`/api/stats/${encodeURIComponent(label!)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, change, trend }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Sucesso", description: "Indicador atualizado." });
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-black text-foreground">Alimentar Dados do Sistema</h1>
              <p className="text-sm text-muted-foreground font-bold">Gerencie os números dos gráficos e indicadores principais</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gráfico de Entradas/Saídas */}
              <Card className="p-6 rounded-[2rem] border-white shadow-premium bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-lg">Gráfico Mensal</h2>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {revenue?.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between gap-4">
                      <span className="font-black text-xs w-10 uppercase text-primary">{item.month}</span>
                      <div className="flex gap-2 flex-1">
                        <div className="space-y-1 flex-1">
                          <label className="text-[9px] font-black text-muted-foreground uppercase">Entradas</label>
                          <Input 
                            type="number" 
                            defaultValue={item.revenue}
                            className="h-8 text-xs rounded-lg"
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (val !== item.revenue) {
                                revenueMutation.mutate({ month: item.month, revenue: val });
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1 flex-1">
                          <label className="text-[9px] font-black text-muted-foreground uppercase">Saídas</label>
                          <Input 
                            type="number" 
                            defaultValue={item.expenses}
                            className="h-8 text-xs rounded-lg"
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (val !== item.expenses) {
                                revenueMutation.mutate({ month: item.month, expenses: val });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Indicadores Principais */}
              <Card className="p-6 rounded-[2rem] border-white shadow-premium bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-lg">Indicadores (Cards)</h2>
                </div>
                <div className="space-y-4">
                  {stats?.map((stat) => (
                    <div key={stat.id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[10px] uppercase text-muted-foreground">{stat.label}</span>
                        <div className="flex gap-1">
                           {['up', 'down', 'neutral'].map(t => (
                             <button 
                               key={t}
                               onClick={() => statsMutation.mutate({ label: stat.label, trend: t as any })}
                               className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase transition-all ${stat.trend === t ? 'bg-primary text-white' : 'bg-white text-muted-foreground border border-gray-100'}`}
                             >
                               {t}
                             </button>
                           ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="space-y-1 flex-1">
                          <label className="text-[9px] font-black text-muted-foreground uppercase">Valor</label>
                          <Input 
                            defaultValue={stat.value}
                            className="h-8 text-xs rounded-lg"
                            onBlur={(e) => {
                              if (e.target.value !== stat.value) {
                                statsMutation.mutate({ label: stat.label, value: e.target.value });
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1 w-20">
                          <label className="text-[9px] font-black text-muted-foreground uppercase">%</label>
                          <Input 
                            type="number"
                            defaultValue={stat.change || 0}
                            className="h-8 text-xs rounded-lg"
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (val !== stat.change) {
                                statsMutation.mutate({ label: stat.label, change: val });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
