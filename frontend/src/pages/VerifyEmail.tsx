import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) return;

    try {
      setLoading(true);
      
      const { error } = await apiClient.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });

      if (error) throw error;

      toast({
        title: "Email confirmado!",
        description: "Sua conta foi ativada com sucesso.",
      });

      navigate("/");
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast({
        title: "Erro na verificação",
        description: err.message || "Código inválido ou expirado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D3B66]">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-40 h-40 opacity-10 animate-float bg-[#468FAF]" />
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 opacity-15 animate-float bg-[#468FAF]" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          
          {/* Logo */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center space-y-4 animate-scale-in">
              <div className="p-4 bg-[#468FAF] backdrop-blur-sm rounded-2xl shadow-[0_20px_60px_rgba(13,59,102,0.4)] border-2 border-[#2A6F97]">
                <img src="./public/svg/4.svg" alt="Olimpo Solar" className="h-40 w-auto drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Olimpo Solar</h1>
              <p className="text-white/90 text-sm font-medium">Confirme seu Email</p>
            </div>
            <div className="h-px w-2/3 mx-auto bg-[#468FAF] opacity-70" />
          </div>

          {/* Card de verificação */}
          <Card className="bg-white/95 backdrop-blur-md shadow-floating border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-[#0D3B66]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#0D3B66]" />
                </div>
                <h2 className="text-xl font-semibold text-[#0D3B66]">Verificar Email</h2>
                <p className="text-[#111111] text-sm mt-2">
                  Digite o código de 6 dígitos enviado para seu email
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="verify-email" className="font-medium text-[#0D3B66]">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="verify-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 border-gray-300 focus:border-[#2A6F97] focus:ring-2 focus:ring-[#468FAF]/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="token" className="font-medium text-[#0D3B66]">Código de Verificação</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest border-gray-300 focus:border-[#2A6F97] focus:ring-2 focus:ring-[#468FAF]/20"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                {/* Botão Verificar */}
                <Button
                  type="submit"
                  className="w-full mt-6 transform hover:scale-[1.02] transition-smooth font-semibold bg-[#0D3B66] hover:bg-[#2A6F97] text-white border-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 rounded-full border-white border-t-transparent"></div>
                      Verificando...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Email
                    </>
                  )}
                </Button>

                {/* Link para voltar */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="text-sm text-[#2A6F97] hover:text-[#0D3B66] underline"
                  >
                    Voltar para o login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
