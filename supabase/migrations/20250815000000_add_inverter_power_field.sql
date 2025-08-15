-- Adicionar campo inverter_power que estava faltando na tabela proposals
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS inverter_power NUMERIC;
