"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-blue-900 dark:to-indigo-900 text-slate-950 dark:text-white transition-all duration-500",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute -inset-[10px] opacity-30 will-change-transform",
              "bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20",
              "animate-pulse",
              showRadialGradient && "mask-image: radial-gradient(ellipse at center, black 40%, transparent 70%)"
            )}
            style={{
              background: 'linear-gradient(-45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.1))',
              backgroundSize: '400% 400%',
              animation: 'aurora-simple 15s ease infinite'
            }}
          />
        </div>
        {children}
      </div>
    </main>
  );
};