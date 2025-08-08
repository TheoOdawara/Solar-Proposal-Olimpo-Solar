-- Expandir tabela proposals com campos detalhados
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'closed')),
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS complement TEXT,
ADD COLUMN IF NOT EXISTS monthly_consumption NUMERIC,
ADD COLUMN IF NOT EXISTS average_bill NUMERIC,
ADD COLUMN IF NOT EXISTS module_brand TEXT,
ADD COLUMN IF NOT EXISTS module_model TEXT,
ADD COLUMN IF NOT EXISTS module_power NUMERIC,
ADD COLUMN IF NOT EXISTS module_quantity INTEGER,
ADD COLUMN IF NOT EXISTS inverter_brand TEXT,
ADD COLUMN IF NOT EXISTS inverter_model TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_conditions TEXT,
ADD COLUMN IF NOT EXISTS valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS required_area NUMERIC,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Criar tabela de customers para evitar duplicação
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cep TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  neighborhood TEXT,
  complement TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Users can view their own customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
ON public.customers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
ON public.customers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for customers updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de anexos para propostas
CREATE TABLE IF NOT EXISTS public.proposal_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on proposal_attachments
ALTER TABLE public.proposal_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_attachments
CREATE POLICY "Users can view attachments of their own proposals" 
ON public.proposal_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE proposals.id = proposal_attachments.proposal_id 
    AND proposals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create attachments for their own proposals" 
ON public.proposal_attachments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE proposals.id = proposal_attachments.proposal_id 
    AND proposals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete attachments of their own proposals" 
ON public.proposal_attachments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE proposals.id = proposal_attachments.proposal_id 
    AND proposals.user_id = auth.uid()
  )
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_valid_until ON public.proposals(valid_until);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_proposal_attachments_proposal_id ON public.proposal_attachments(proposal_id);