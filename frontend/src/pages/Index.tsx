import React, { useState } from 'react';
import ProposalForm from "@/components/ProposalForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Index = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <main className="p-6">
        <ProposalForm onProposalDataChange={handleProposalDataChange} />
      </main>
      
      <WhatsAppButton proposalData={proposalData} />
      <Footer />
    </div>
  );
};

export default Index;
