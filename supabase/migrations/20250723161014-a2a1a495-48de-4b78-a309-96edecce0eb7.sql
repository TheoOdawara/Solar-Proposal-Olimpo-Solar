-- Fix RLS policies for user_roles table to allow role assignment
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- Create proper RLS policies
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow role assignment during signup" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (true);