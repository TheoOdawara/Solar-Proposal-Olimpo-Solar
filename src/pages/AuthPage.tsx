import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try { await signIn(email, password); } catch (err) { console.debug('Sign-in failed'); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;
    try { await signUp(email, password); } catch (err) { console.debug('Sign-up failed'); }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#022136]">
      {/* Elementos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-40 h-40 opacity-10 animate-float bg-[#ffbf06]" />
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 opacity-15 animate-float bg-[#ffbf06]" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/4 w-24 h-24 opacity-20 animate-float bg-[#ffbf06]" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          
          {/* Logo */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center space-y-4 animate-scale-in">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
                <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Olimpo Solar</h1>
              <p className="text-white/90 text-sm font-medium">Sistema de Propostas Comerciais</p>
            </div>
            <div className="h-px w-2/3 mx-auto bg-[#ffbf06] opacity-50" />
          </div>

          {/* Card de autenticação */}
          <Card className="bg-white/95 backdrop-blur-md shadow-floating border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-[#022136]">Acesso ao Sistema</h2>
                <p className="text-gray-600 text-sm mt-1">Entre ou crie sua conta para continuar</p>
              </div>

              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger
                    value="login"
                    className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#ffbf06] data-[state=active]:text-[#022136] transition-smooth"
                  >
                    <LogIn className="h-4 w-4" /> Entrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#ffbf06] data-[state=active]:text-[#022136] transition-smooth"
                  >
                    <UserPlus className="h-4 w-4" /> Cadastrar
                  </TabsTrigger>
                </TabsList>

                {/* Conteúdo Login */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {/* E-mail */}
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="font-medium text-[#022136]">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* Senha */}
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="font-medium text-[#022136]">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* Botão Entrar */}
                    <Button
                      type="submit"
                      className="w-full mt-6 transform hover:scale-[1.02] transition-smooth font-semibold bg-[#ffbf06] text-[#022136] border-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 rounded-full border-[#022136] border-t-transparent"></div>
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
                  
                  {/* Google Login */}
                  <div className="mt-4">
                    <Separator className="my-4" />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50 transition-smooth"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continuar com Google
                    </Button>
                  </div>
                </TabsContent>

                {/* Conteúdo Cadastro */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* E-mail */}
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="font-medium text-[#022136]">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* Senha */}
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="font-medium text-[#022136]">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* Confirmar Senha */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="font-medium text-[#022136]">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
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
                    {/* Botão Criar Conta */}
                    <Button
                      type="submit"
                      className="w-full mt-6 transform hover:scale-[1.02] transition-smooth font-semibold bg-[#ffbf06] text-[#022136] border-none"
                      disabled={loading || password !== confirmPassword}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 rounded-full border-[#022136] border-t-transparent"></div>
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
                  
                  {/* Google Login */}
                  <div className="mt-4">
                    <Separator className="my-4" />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50 transition-smooth"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continuar com Google
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Voltar */}
              <div className="mt-6 pt-4">
                <Separator />
                <div className="text-center">
                  <Link to="/">
                    <Button variant="ghost" className="text-[#022136] hover:bg-gray-100 transition-smooth">
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
