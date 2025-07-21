import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ProposalForm from '@/components/ProposalForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

const Index = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useRoles();
  const [proposalData, setProposalData] = useState<{
    clientName: string;
    systemPower: number;
    monthlyGeneration: number;
    monthlySavings: number;
    totalValue: number;
  }>({
    clientName: '',
    systemPower: 0,
    monthlyGeneration: 0,
    monthlySavings: 0,
    totalValue: 0
  });

  const handleProposalDataChange = (data: typeof proposalData) => {
    setProposalData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Enhanced header with solar theme */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-gradient-surface/80 backdrop-blur-md shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-solar rounded-lg shadow-button">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-solar bg-clip-text text-transparent">
                  Olimpo Solar
                </h1>
                <p className="text-xs text-muted-foreground">
                  Gerador de Propostas
                </p>
              </div>
            </div>

            {/* User info and controls */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full text-sm">
                <div className="h-2 w-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">{user?.email}</span>
              </div>
              
              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-smooth"
                >
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Relatórios</span>
                  </Link>
                </Button>
              )}
              
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/40 transition-smooth"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="animate-fade-in">
        <ProposalForm onProposalDataChange={handleProposalDataChange} />
      </main>
      
      <WhatsAppButton proposalData={proposalData} />
      <Footer />
    </div>
  );
};

export default Index;
