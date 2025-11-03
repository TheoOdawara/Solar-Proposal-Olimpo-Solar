// Placeholder: gerenciamento de perfis será implementado
export type UserWithRole = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export async function listProfiles(): Promise<UserWithRole[]> {
  // TODO: implementar listagem de perfis
  return [];
}

export async function validateEmail(email: string): Promise<boolean> {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}
