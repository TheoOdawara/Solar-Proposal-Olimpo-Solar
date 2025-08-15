-- SCHEMA REAL DO SUPABASE EM PRODUÇÃO  
-- Sincronizado em: 2025-08-15
-- Status: ✅ ATUALIZADO E FUNCIONANDO

CREATE TABLE public.proposals (
  connection_type text,
  desired_kwh numeric,
  price_per_kwp numeric,
  inverter_power numeric,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'sent'::text, 'approved'::text, 'rejected'::text, 'closed'::text])),
  cep text,
  address text,
  city text,
  state text,
  neighborhood text,
  complement text,
  monthly_consumption numeric,
  average_bill numeric,
  module_brand text,
  module_model text,
  module_power numeric,
  module_quantity integer,
  inverter_brand text,
  inverter_model text,
  payment_method text,
  payment_conditions text,
  valid_until date DEFAULT (CURRENT_DATE + '30 days'::interval),
  notes text,
  required_area numeric,
  phone text,
  email text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  client_name text NOT NULL,
  system_power numeric NOT NULL,
  monthly_generation numeric NOT NULL,
  monthly_savings numeric NOT NULL,
  total_value numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  seller_name text,
  seller_id uuid,
  CONSTRAINT proposals_pkey PRIMARY KEY (id),
  CONSTRAINT proposals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT proposals_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES auth.users(id)
);

-- ✅ TODOS OS CAMPOS NECESSÁRIOS EXISTEM:
-- connection_type, desired_kwh, price_per_kwp, inverter_power
-- O erro 400 deve ter sido resolvido!
