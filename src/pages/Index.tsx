import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import ProposalForm from '@/components/ProposalForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut } = useAuth();
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
    <div className="min-h-screen">
      {/* Barra de usuário */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user?.email}
          </div>
          <Button
            onClick={signOut}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <ProposalForm onProposalDataChange={handleProposalDataChange} />
      <WhatsAppButton proposalData={proposalData} />
      <Footer />
    </div>
  );
};

export default Index;
