import React from "react";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const GerenciarPerfis: React.FC = () => {
  const { hasAdminAccess } = useAdminAccess();

  if (!hasAdminAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-xl font-bold text-[#0D3B66] mb-2">Acesso restrito</h2>
        <p className="text-[#2A6F97]">Somente administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#0D3B66] mb-4">Gerenciamento de Perfis</h1>
      <p className="text-[#2A6F97] mb-6">Aqui você poderá visualizar, editar e excluir perfis de usuários do sistema.</p>
      {/* Conteúdo de gerenciamento será implementado aqui */}
      <div className="bg-[#F6F6F6] rounded-lg p-6 shadow">
        <span className="text-[#468FAF]">Funcionalidade em construção...</span>
      </div>
    </div>
  );
};

export default GerenciarPerfis;
