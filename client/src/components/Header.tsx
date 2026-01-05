import { Search, Bell, Menu } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-transparent px-6 py-4 flex items-center justify-between lg:pl-80">
      
      {/* Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6 bg-white/50 px-4 py-2 rounded-full shadow-sm border border-white/50">
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full border border-gray-100 focus-within:border-primary/20 focus-within:ring-4 focus-within:ring-primary/5 transition-all w-64">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50"
          />
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-foreground leading-none tracking-tight">Usuário administrador</p>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Conta gratuita</p>
          </div>
          {/* Avatar with Premium Ring */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary via-purple-400 to-indigo-400 p-[2px] rotate-3 hover:rotate-0 transition-transform duration-300 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" 
                 alt="Avatar do usuário" 
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
