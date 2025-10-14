-- Migration: Add extended fields to proposals table
-- Date: 2025-10-14
-- Description: Adiciona campos de garantias, estrutura e monitoramento

-- Adicionar novos campos para características do projeto
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS structure_type TEXT,
ADD COLUMN IF NOT EXISTS monitoring TEXT;

-- Adicionar campos de garantias
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS module_warranty TEXT DEFAULT '25 anos de eficiência e 12 anos fabricação',
ADD COLUMN IF NOT EXISTS inverter_warranty TEXT,
ADD COLUMN IF NOT EXISTS micro_inverter_warranty TEXT,
ADD COLUMN IF NOT EXISTS structure_warranty TEXT,
ADD COLUMN IF NOT EXISTS installation_warranty TEXT;

-- Comentários para documentação
COMMENT ON COLUMN proposals.structure_type IS 'Tipo de estrutura utilizada no projeto (ex: Fibrocimento, Metálica, etc.)';
COMMENT ON COLUMN proposals.monitoring IS 'Sistema de monitoramento incluído (ex: App fabricante, Monitoramento dedicado)';
COMMENT ON COLUMN proposals.module_warranty IS 'Garantia dos módulos fotovoltaicos';
COMMENT ON COLUMN proposals.inverter_warranty IS 'Garantia do inversor';
COMMENT ON COLUMN proposals.micro_inverter_warranty IS 'Garantia do micro inversor (se aplicável)';
COMMENT ON COLUMN proposals.structure_warranty IS 'Garantia da estrutura de fixação';
COMMENT ON COLUMN proposals.installation_warranty IS 'Garantia da instalação/mão de obra';
