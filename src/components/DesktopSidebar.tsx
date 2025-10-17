import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, FileText, History, LogOut } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5 mr-2 text-[#2A6F97]" /> },
  { label: "Gerador de Proposta", href: "/", icon: <FileText className="h-5 w-5 mr-2 text-[#2A6F97]" /> },
  { label: "Histórico", href: "/historico", icon: <History className="h-5 w-5 mr-2 text-[#2A6F97]" /> },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut, loading } = useAuth();
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r-2 border-[#E5EAF1] shadow-lg fixed top-0 left-0 z-40 pt-0">
      {/* Logo no topo */}
      <div className="flex items-center justify-center h-20 border-b border-[#E5EAF1] bg-white">
        <img src="/svg/1.svg" alt="Olimpo Solar" className="h-12 w-auto" />
      </div>
      {/* Navegação */}
      <nav className="flex flex-col gap-3 px-4 py-6 flex-1">
        {links.map(link => (
          <Link
            key={link.href}
            to={link.href}
                className={`flex items-center py-3 px-4 rounded-xl font-semibold text-base shadow-md transition-all border-2 ${location.pathname === link.href ? 'bg-[#0D3B66] text-white border-[#0D3B66] shadow-lg' : 'bg-white text-[#0D3B66] border-[#E5EAF1] hover:bg-[#468FAF]/20 hover:text-[#0D3B66] hover:border-[#468FAF] hover:shadow-lg focus:bg-[#468FAF]/20 focus:text-[#0D3B66] focus:border-[#468FAF] focus:shadow-lg'}`}
            style={{ boxShadow: location.pathname === link.href ? '0 2px 12px rgba(13,59,102,0.08)' : undefined }}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Separador */}
      <div className="px-4">
        <hr className="border-[#E5EAF1] my-2" />
      </div>
      {/* Área de sair */}
      <div className="flex flex-col items-center px-4 pb-6">
        <button
          type="button"
          className="flex items-center gap-2 text-[#2A6F97] hover:text-[#0D3B66] text-sm font-semibold px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D3B66]"
          onClick={signOut}
          disabled={loading}
          aria-label="Sair do sistema"
        >
          <LogOut className="h-5 w-5" /> Sair
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
