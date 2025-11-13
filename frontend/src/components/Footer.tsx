import React from 'react';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';

const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <footer className={`w-full ${className}`}>
      {/* Desktop / tablet footer (sm and up) */}
      <div className="hidden sm:block">
        <div className={`page-footer w-full rounded-lg bg-[#0D3B66] text-white text-xs py-2 px-3`}>
          <div className="grid grid-cols-4 gap-3 items-center">
            <span>(67) 99668-0242</span>
            <span>@olimpo.energiasolar</span>
            <span>adm.olimposolar@gmail.com</span>
            <span>R. Eduardo Santos Pereira, 1831 – Centro, Campo Grande</span>
          </div>
        </div>
      </div>

      {/* Mobile footer (visible only on xs) */}
      <div className="block sm:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between text-sm">
            <a href="tel:+55679966680242" className="flex flex-col items-center text-[#0D3B66]">
              <Phone className="h-5 w-5" />
              <span className="text-xs mt-1">Ligar</span>
            </a>

            <a href="https://instagram.com/olimpo.energiasolar" target="_blank" rel="noreferrer" className="flex flex-col items-center text-[#2A6F97]">
              <Instagram className="h-5 w-5" />
              <span className="text-xs mt-1">Instagram</span>
            </a>

            <a href="mailto:adm.olimposolar@gmail.com" className="flex flex-col items-center text-[#0D3B66]">
              <Mail className="h-5 w-5" />
              <span className="text-xs mt-1">Email</span>
            </a>

            <a href="https://www.google.com/maps/search/R.+Eduardo+Santos+Pereira+1831" target="_blank" rel="noreferrer" className="flex flex-col items-center text-[#468FAF]">
              <MapPin className="h-5 w-5" />
              <span className="text-xs mt-1">Local</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;