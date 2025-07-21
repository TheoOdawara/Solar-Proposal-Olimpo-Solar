import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Número do WhatsApp da Olimpo Solar (exemplo)
    const phoneNumber = "5567999999999"; // Alterar para o número real
    const message = "Olá! Preciso de suporte com o gerador de propostas.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        variant="whatsapp"
        size="lg"
        className="rounded-full p-4 h-16 w-16 shadow-floating hover:scale-110 transition-all duration-300"
        title="Suporte via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default WhatsAppButton;