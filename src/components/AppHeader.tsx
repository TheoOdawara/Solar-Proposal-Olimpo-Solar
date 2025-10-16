import React, { useState } from "react";
import { Link } from "react-router-dom";

export const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <nav className="absolute top-16 left-4 bg-white shadow-lg rounded-lg py-2 px-4 flex flex-col gap-2 min-w-[180px] border z-50 animate-fade-in">
            <Link to="/dashboard" className="py-2 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium text-center" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/" className="py-2 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium text-center" onClick={() => setMenuOpen(false)}>
              Gerador de Proposta
            </Link>
            <Link to="/historico" className="py-2 px-2 rounded hover:bg-[#F6F6F6] text-[#0D3B66] font-medium text-center" onClick={() => setMenuOpen(false)}>
              Histórico
            </Link>
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
