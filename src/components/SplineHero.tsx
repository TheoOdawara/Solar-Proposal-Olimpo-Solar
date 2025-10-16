import React from "react";
import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
 
export function SplineHero() {
  return (
  <Card className="w-full h-[500px] md:h-[500px] bg-white relative overflow-hidden border border-[#0D3B66]/30 rounded-xl shadow-md transition-all duration-300">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="md:flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0D3B66]">
            Gerador de Propostas
          </h1>
          <p className="mt-4 text-[#2A6F97] max-w-lg text-justify">
            Sistema inteligente para criação de propostas solares. Automatize seus cálculos e gere propostas profissionais em segundos.
          </p>
        </div>

        {/* Right content */}
        <div className="md:flex-1 w-full md:w-auto relative flex items-center justify-center">
          <div className="w-full h-[220px] md:h-full md:w-full">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}