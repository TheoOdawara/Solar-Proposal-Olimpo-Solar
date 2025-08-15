-- Script para verificar e adicionar campos faltantes na tabela proposals
-- Execute este SQL diretamente no Supabase Dashboard

-- Verificar se os campos existem
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'proposals' 
  AND table_schema = 'public'
  AND column_name IN ('connection_type', 'desired_kwh', 'price_per_kwp', 'inverter_power')
ORDER BY column_name;

-- Adicionar campos se não existirem (execute um por vez se necessário)
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS connection_type TEXT;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS desired_kwh NUMERIC;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS price_per_kwp NUMERIC;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS inverter_power NUMERIC;

-- Verificar novamente após adicionar
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'proposals' 
  AND table_schema = 'public'
  AND column_name IN ('connection_type', 'desired_kwh', 'price_per_kwp', 'inverter_power')
ORDER BY column_name;
