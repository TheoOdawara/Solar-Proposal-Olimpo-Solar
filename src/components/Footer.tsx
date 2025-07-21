import React from 'react';
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 pb-6">
      <Card className="bg-gradient-card shadow-card border-0">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Endereço */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold">Endereço</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Rua das Tecnologias, 123</p>
                <p>Jardim dos Estados</p>
                <p>Campo Grande - MS</p>
                <p>CEP: 79000-000</p>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-secondary">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">Contato</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>(67) 3333-4444</p>
                <p>(67) 99999-8888</p>
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Mail className="h-3 w-3" />
                  <span>contato@olimposolar.com.br</span>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
                <span className="font-semibold">Redes Sociais</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <a
                  href="https://instagram.com/olimposolar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-solar rounded-lg hover:shadow-button transition-smooth group"
                >
                  <Instagram className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://facebook.com/olimposolar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-solar rounded-lg hover:shadow-button transition-smooth group"
                >
                  <Facebook className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>@olimposolar</p>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Olimpo Solar. Todos os direitos reservados. | Sistema interno para vendedores
            </p>
          </div>
        </div>
      </Card>
    </footer>
  );
};

export default Footer;