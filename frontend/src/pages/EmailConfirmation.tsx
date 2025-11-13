import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Aguarda um pouco para garantir que a confirmação foi processada
    const timer = setTimeout(() => {
      // Tenta fechar a aba (só funciona se foi aberta via window.open)
      window.close();
      
      // Se não conseguir fechar, redireciona para /proposta
      setTimeout(() => {
        if (!window.closed) {
          navigate('/proposta');
        }
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D3B66]">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-floating p-8 max-w-md text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#0D3B66] mb-2">Email Confirmado!</h1>
        <p className="text-[#2A6F97] mb-4">Seu email foi confirmado com sucesso.</p>
        <p className="text-sm text-gray-600">Esta janela será fechada automaticamente...</p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
