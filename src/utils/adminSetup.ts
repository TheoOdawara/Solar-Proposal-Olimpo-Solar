import { supabase } from '@/integrations/supabase/client';

// Utility to set the first user as admin
export const setupFirstAdmin = async (userId: string) => {
  try {
    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (existingRole) {
      return existingRole.role;
    }

    // Check if there are any admins in the system
    const { data: admins, error: adminError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (adminError) {
      console.error('Error checking for admins:', adminError);
      return 'user';
    }

    // If no admins exist, make this user an admin
    const roleToAssign = (admins && admins.length === 0) ? 'admin' : 'user';

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: roleToAssign });

    if (error) {
      console.error('Error assigning role:', error);
      return 'user';
    }

    return roleToAssign;
  } catch (error) {
    console.error('Error in setupFirstAdmin:', error);
    return 'user';
  }
};