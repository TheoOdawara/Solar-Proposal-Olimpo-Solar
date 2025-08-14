-- Adicionar campos técnicos que faltam na tabela proposals
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS connection_type TEXT,
ADD COLUMN IF NOT EXISTS desired_kwh NUMERIC,
ADD COLUMN IF NOT EXISTS price_per_kwp NUMERIC;
