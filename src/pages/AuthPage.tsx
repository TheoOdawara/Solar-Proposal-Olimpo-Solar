import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import olimpoLogo from "/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signIn, signUp, loading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await signIn(email, password);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      return;
    }
    
    try {
      await signUp(email, password);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#022136' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-40 h-40 opacity-10 animate-float" style={{ backgroundColor: '#ffbf06' }}></div>
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 opacity-15 animate-float" style={{ backgroundColor: '#ffbf06', animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/4 w-24 h-24 opacity-20 animate-float" style={{ backgroundColor: '#ffbf06', animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Logo section */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 animate-scale-in">
              <div className="relative">
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
                  <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Olimpo Solar</h1>
                <p className="text-white/90 text-sm font-medium">Sistema de Propostas Comerciais</p>
              </div>
            </div>
            <div className="h-px w-2/3 mx-auto" style={{ backgroundColor: '#ffbf06', opacity: 0.5 }}></div>
          </div>

          <Card className="bg-white/95 backdrop-blur-md shadow-floating border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold" style={{ color: '#022136' }}>
                  Acesso ao Sistema
                </h2>
                <p className="text-gray-600 text-sm mt-1">Entre ou crie sua conta para continuar</p>
              </div>
              
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="login" 
                    className="flex items-center gap-2 data-[state=active]:text-white transition-smooth"
                    style={{ 
                      '--tw-data-state-active-bg': '#ffbf06',
                      '--tw-data-state-active-color': '#022136'
                    } as any}
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="flex items-center gap-2 data-[state=active]:text-white transition-smooth"
                    style={{ 
                      '--tw-data-state-active-bg': '#ffbf06',
                      '--tw-data-state-active-color': '#022136'
                    } as any}
                  >
                    <UserPlus className="h-4 w-4" />
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="font-medium" style={{ color: '#022136' }}>E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 transition-smooth border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="font-medium" style={{ color: '#022136' }}>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 transition-smooth border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 transform hover:scale-[1.02] transition-smooth font-semibold"
                      style={{ 
                        backgroundColor: '#ffbf06', 
                        color: '#022136',
                        border: 'none'
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 rounded-full" style={{ borderColor: '#022136', borderTopColor: 'transparent' }}></div>
                          Entrando no sistema...
                        </div>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Entrar no Sistema
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="font-medium" style={{ color: '#022136' }}>E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 transition-smooth border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="font-medium" style={{ color: '#022136' }}>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 transition-smooth border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="font-medium" style={{ color: '#022136' }}>Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 transition-smooth border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      {password !== confirmPassword && confirmPassword && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mt-2">
                          <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
                          <p className="text-sm text-destructive font-medium">
                            As senhas não coincidem
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 transform hover:scale-[1.02] transition-smooth font-semibold"
                      style={{ 
                        backgroundColor: '#ffbf06', 
                        color: '#022136',
                        border: 'none'
                      }}
                      disabled={loading || password !== confirmPassword}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 rounded-full" style={{ borderColor: '#022136', borderTopColor: 'transparent' }}></div>
                          Criando sua conta...
                        </div>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Criar Nova Conta
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>
                <div className="text-center">
                  <Link to="/">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:bg-gray-100 transition-smooth"
                      style={{ color: '#022136' }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar ao gerador
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;