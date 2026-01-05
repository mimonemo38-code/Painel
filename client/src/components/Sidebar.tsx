import { Link, useLocation } from "wouter";
import { LayoutDashboard, LogOut, Package, Box } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export function Sidebar() {
  const [location, setLocation] = useLocation();

  const { data: materials } = useQuery({
    queryKey: ["/api/materials"],
    queryFn: async () => {
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed to fetch materials");
      return res.json();
    }
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-border/50 flex flex-col p-6 z-20 shadow-xl shadow-purple-900/5 hidden lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => setLocation("/")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        <span className="font-display font-bold text-2xl text-foreground">MatDash</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 -mr-2">
        <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 px-4 flex items-center justify-between">
          <span>Códigos de Materiais</span>
          <Package className="w-3 h-3" />
        </div>
        
        <Link href="/" className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group mb-4
          ${location === "/" 
            ? "bg-primary/5 text-primary font-black border border-primary/10" 
            : "text-muted-foreground hover:bg-purple-50 hover:text-primary"}
        `}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-xs">Visão Global</span>
        </Link>

        <Link href="/management" className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group mb-4
          ${location === "/management" 
            ? "bg-primary/5 text-primary font-black border border-primary/10" 
            : "text-muted-foreground hover:bg-purple-50 hover:text-primary"}
        `}>
          <Box className="w-4 h-4" />
          <span className="text-xs">Gestão de Materiais</span>
        </Link>

        <Link href="/config" className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group mb-4
          ${location === "/config" 
            ? "bg-primary/5 text-primary font-black border border-primary/10" 
            : "text-muted-foreground hover:bg-purple-50 hover:text-primary"}
        `}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-xs">Alimentar Gráficos</span>
        </Link>

        {materials?.map((material: any) => {
          const href = `/material/${encodeURIComponent(material.code)}`;
          const isActive = location === href;
          return (
            <motion.button 
              key={material.code} 
              onClick={() => setLocation(href)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20 font-bold" 
                  : "text-muted-foreground hover:bg-purple-50 hover:text-primary"}
              `}
            >
              <span className="text-[10px] font-mono tracking-tighter">{material.code}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-6 mt-6 border-t border-border/50">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-2xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
