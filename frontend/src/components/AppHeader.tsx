import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User as UserIcon } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  return (
    <header className="w-full h-16 flex items-center justify-between px-4 bg-white border-b shadow-sm fixed top-0 left-0 z-50">
      {/* Menu Hamburguer à esquerda (apenas mobile) */}
      <div className="flex items-center h-full md:hidden">
        <button
          className="relative w-10 h-10 flex flex-col items-center justify-center group"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`block w-8 h-1 bg-[#0D3B66] rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-8 h-1 bg-[#0D3B66] rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-8 h-1 bg-[#0D3B66] rounded transition-all duration-300 no-underline ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Menu Dropdown */}
        {menuOpen && (
          <nav className="absolute top-16 left-2 right-2 bg-white shadow-lg rounded-lg py-4 px-3 flex flex-col gap-2 border z-50 animate-fade-in">
            <div className="flex items-center gap-3 px-2 pb-2 border-b">
              <div className="p-2 bg-[#F6F6F6] rounded-full">
                <UserIcon className="h-5 w-5 text-[#0D3B66]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{user?.email ? user.email.split('@')[0] : 'Usuário'}</div>
                <div className="text-xs text-muted-foreground">{user?.email ?? ''}</div>
              </div>
              <button onClick={() => { setMenuOpen(false); }} className="text-sm px-2 py-1 text-muted-foreground">Fechar</button>
            </div>

            <Link to="/" className="py-3 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium" onClick={() => setMenuOpen(false)}>
              Gerador de Proposta
            </Link>
            <Link to="/historico" className="py-3 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium" onClick={() => setMenuOpen(false)}>
              Histórico
            </Link>
            <Link to="/dashboard" className="py-3 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>

            <div className="pt-2 border-t flex flex-col gap-2">
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    setMenuOpen(false);
                  } catch (e) {
                    // log and show user-friendly message
                    console.error('Logout error', e);
                    toast({ title: 'Erro ao desconectar', description: 'Tente novamente', variant: 'destructive' });
                  }
                }}
                className="w-full text-left py-3 px-2 rounded bg-red-50 hover:bg-red-100 text-red-600 font-medium flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Logo centralizada */}
      <div className="flex-1 flex justify-center">
        <Link to="/">
          <img src="public/svg/1.svg" alt="Olimpo Solar" className="h-40 w-auto" />
        </Link>
      </div>

      {/* Perfil no canto direito */}
      <div className="flex items-center h-full">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D3B66] hover:bg-[#468FAF]/10 border border-[#468FAF]/20 transition">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ffffffff" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-2.5 3.5-4.5 8-4.5s8 2 8 4.5" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
