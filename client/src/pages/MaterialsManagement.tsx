import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Material } from "@shared/schema";
import { Search, Save, Package, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MaterialsManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const mutation = useMutation({
    mutationFn: async ({ code, currentBalance, orderPoint }: Partial<Material>) => {
      const res = await fetch(`/api/materials/${encodeURIComponent(code!)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentBalance, orderPoint }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      toast({ title: "Sucesso", description: "Dados atualizados com sucesso." });
    },
  });

  const filteredMaterials = materials?.filter(m => 
    m.code.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-white">
              <div>
                <h1 className="text-2xl font-black text-foreground">Gestão de Materiais</h1>
                <p className="text-sm text-muted-foreground font-bold">Atualize o saldo e ponto de pedido de cada item</p>
              </div>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por código ou descrição..." 
                  className="pl-10 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredMaterials?.map(material => (
                <div key={material.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-white flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{material.code}</p>
                      <h3 className="font-bold text-foreground truncate">{material.description}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{material.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="space-y-1 flex-1 md:w-32">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Saldo Atual</label>
                      <Input 
                        type="number" 
                        defaultValue={material.currentBalance}
                        className="h-9 rounded-lg"
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (val !== material.currentBalance) {
                            mutation.mutate({ code: material.code, currentBalance: val });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1 flex-1 md:w-32">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Ponto Pedido</label>
                      <Input 
                        type="number" 
                        defaultValue={material.orderPoint}
                        className="h-9 rounded-lg"
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (val !== material.orderPoint) {
                            mutation.mutate({ code: material.code, orderPoint: val });
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 min-w-[100px] justify-center">
                      {material.currentBalance <= material.orderPoint ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          <span className="text-[10px] font-black text-rose-500 uppercase">Repor</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Estoque OK</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
