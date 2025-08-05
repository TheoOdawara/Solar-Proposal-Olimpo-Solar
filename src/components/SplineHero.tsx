'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import VaporizeTextCycle, { Tag } from "@/components/ui/vaporize-text-cycle"
 
export function SplineHero() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <div className="h-16">
            <VaporizeTextCycle
              texts={["Gerador de Propostas"]}
              font={{
                fontFamily: "Inter, sans-serif",
                fontSize: "48px",
                fontWeight: 700
              }}
              color="rgb(255, 255, 255)"
              spread={3}
              density={6}
              animation={{
                vaporizeDuration: 3,
                fadeInDuration: 1.5,
                waitDuration: 2
              }}
              direction="left-to-right"
              alignment="left"
              tag={Tag.H1}
            />
          </div>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Sistema inteligente para criação de propostas solares. 
            Automatize seus cálculos e gere propostas profissionais em segundos.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}