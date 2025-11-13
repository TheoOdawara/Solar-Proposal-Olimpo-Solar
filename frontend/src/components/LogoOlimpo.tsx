import React from "react";

interface LogoOlimpoProps {
  className?: string;
  variant?: "1" | "2" | "3" | "4";
}

/**
 * Componente de logo Olimpo Solar usando o novo padrão visual.
 * @param className - Classes CSS adicionais
 * @param variant - Variante do logo SVG (1, 2, 3 ou 4) - padrão é "1"
 */
export function LogoOlimpo({ className = "", variant = "1" }: LogoOlimpoProps) {
  const logoPath = `/${variant}.svg`;
  
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <img
        src={logoPath}
        alt="Olimpo Solar"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}
