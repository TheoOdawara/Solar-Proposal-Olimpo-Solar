import React from 'react';

const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <footer className={`page-footer w-full rounded-lg bg-slate-800 text-white text-xs py-2 px-3 ${className}`}>
      <div className="grid grid-cols-4 gap-3 items-center">
        <span>(67) 99668-0242</span>
        <span>@olimpo.energiasolar</span>
        <span>adm.olimposolar@gmail.com</span>
        <span>R. Eduardo Santos Pereira, 1831 – Centro, Campo Grande</span>
      </div>
    </footer>
  );
};

export default Footer;