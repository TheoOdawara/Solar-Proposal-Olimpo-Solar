import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2 } from "lucide-react";

interface ProposalData {
  clientName: string;
  systemPower: number;
  monthlyGeneration: number;
  monthlySavings: number;
  totalValue: number;
}

interface WhatsAppButtonProps {
  proposalData?: ProposalData;
}

const WhatsAppButton = ({ proposalData }: WhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5567999999999"; // Alterar para o número real
    
    let message: string;
    
    if (proposalData && proposalData.clientName) {
      // Mensagem com dados da proposta
      message = `🌞 *PROPOSTA OLIMPO SOLAR* 🌞

📋 *Cliente:* ${proposalData.clientName}

⚡ *Sistema Fotovoltaico:*
• Potência: ${proposalData.systemPower} kWp
• Geração mensal: ${proposalData.monthlyGeneration} kWh
• Economia mensal: R$ ${proposalData.monthlySavings.toLocaleString('pt-BR')}
• Valor total: R$ ${proposalData.totalValue.toLocaleString('pt-BR')}

✨ *Vantagens da Energia Solar:*
• ⚡ Redução de até 95% na conta de energia
• 🌱 Energia 100% limpa e renovável
• 📈 Valorização do seu imóvel
• 🛡️ Garantia de 25 anos dos painéis

💬 Gostaria de mais informações sobre esta proposta!`;
    } else {
      // Mensagem padrão de suporte
      message = "Olá! Preciso de suporte com o gerador de propostas da Olimpo Solar.";
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const hasProposalData = proposalData && proposalData.clientName;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        variant="whatsapp"
        size="lg"
        className="rounded-full p-4 h-16 w-16 shadow-floating hover:scale-110 transition-all duration-300"
        title={hasProposalData ? "Compartilhar proposta via WhatsApp" : "Suporte via WhatsApp"}
      >
        {hasProposalData ? (
          <Share2 className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default WhatsAppButton;