import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listProfiles, updateProfile, removeProfile, validateEmail, UserWithRole } from '@/integrations/supabase/profiles';
import { useAdminAccess } from "@/hooks/useAdminAccess";

const GerenciarPerfis: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { hasAdminAccess } = useAdminAccess();

  const [profiles, setProfiles] = React.useState<UserWithRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState<{ id?: string; full_name: string; email: string; role: string; password: string; confirmPassword: string }>({ full_name: '', email: '', role: '', password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    listProfiles().then(setProfiles).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    if (!form.full_name || !form.email || !form.role || !form.password || !form.confirmPassword) {
      setError('Preencha todos os campos.'); setSaving(false); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem.'); setSaving(false); return;
    }
    const valid = await validateEmail(form.email);
    if (!valid) {
      setError('E-mail inválido ou já cadastrado.'); setSaving(false); return;
    }
    try {
      let profile: UserWithRole;
      if (form.id) {
        profile = await updateProfile(form.id, { full_name: form.full_name, role: form.role });
        setProfiles(p => p.map(pr => pr.id === profile.id ? profile : pr));
      } else {
          // Cria usuário diretamente via Admin API usando Service Role Key
          try {
            const clientModule = await import('@/integrations/supabase/client');
            
            // Create user via admin API
            const { data: userData, error: userError } = await clientModule.supabase.auth.admin.createUser({
              email: form.email,
              password: form.password,
              email_confirm: true
            });
            
            if (userError || !userData.user) {
              setError(userError?.message || 'Erro ao criar usuário.');
              setSaving(false);
              return;
            }

            const userId = userData.user.id;

            // Insert into profiles table
            const { error: profileError } = await clientModule.supabase
              .from('profiles')
              .insert({ id: userId, full_name: form.full_name });
            
            if (profileError) {
              setError('Erro ao criar profile: ' + profileError.message);
              setSaving(false);
              return;
            }

            // Insert into user_roles table
            const { error: roleError } = await clientModule.supabase
              .from('user_roles')
              .insert({ user_id: userId, role: form.role });
            
            if (roleError) {
              setError('Erro ao atribuir role: ' + roleError.message);
              setSaving(false);
              return;
            }

            // Recarrega lista de profiles após criação
            const updated = await listProfiles();
            setProfiles(updated);
            profile = updated.find(p => p.email === form.email) || updated[0];
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Erro ao criar usuário.');
            setSaving(false);
            return;
          }
        }
  setForm({ full_name: '', email: '', role: '', password: '', confirmPassword: '' });
      setShowModal(false);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Erro ao salvar perfil.');
    }
    setSaving(false);
  };

  const handleEdit = (profile: UserWithRole) => {
  setForm({ ...profile, full_name: profile.full_name, password: '', confirmPassword: '' });
    setShowModal(true);
  };

  const handleRemove = async (id: string) => {
    await removeProfile(id);
    setProfiles(p => p.filter(pr => pr.id !== id));
  };

  if (!hasAdminAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-xl font-bold text-[#0D3B66] mb-2">Acesso restrito</h2>
        <p className="text-[#2A6F97]">Somente administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#0D3B66] mb-4">Gerenciamento de Perfis</h1>
      <p className="text-[#2A6F97] mb-6">Adicione, edite ou remova perfis do sistema. Roles obrigatórias e email validado automaticamente.</p>
      <div className="bg-[#F6F6F6] rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-[#2A6F97]">Perfis cadastrados</span>
          <button className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg font-medium" onClick={() => { setForm({ full_name: '', email: '', role: '', password: '', confirmPassword: '' }); setShowModal(true); }}>Adicionar Perfil</button>
        </div>
        {loading ? (
          <div className="text-[#468FAF]">Carregando perfis...</div>
        ) : (
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="text-xs text-[#468FAF] uppercase">
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id} className="border-b border-[#E0E7EF]">
                  <td className="py-2">{profile.full_name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.role}</td>
                  <td>
                    <button className="text-[#2A6F97] mr-2" onClick={() => handleEdit(profile)}>Editar</button>
                    <button className="text-red-500" onClick={() => handleRemove(profile.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Modal de cadastro/edição */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#0D3B66] mb-4">{form.id ? 'Editar Perfil' : 'Novo Perfil'}</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Nome" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full border border-[#E0E7EF] rounded-lg px-3 py-2" />
                <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-[#E0E7EF] rounded-lg px-3 py-2" />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-[#E0E7EF] rounded-lg px-3 py-2 pr-10 text-[#0D3B66] font-medium"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#222] bg-transparent p-1 rounded transition-colors duration-200 hover:text-[#468FAF] focus:outline-none cursor-pointer"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar senha"
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className="w-full border border-[#E0E7EF] rounded-lg px-3 py-2 pr-10 text-[#0D3B66] font-medium"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#222] bg-transparent p-1 rounded transition-colors duration-200 hover:text-[#468FAF] focus:outline-none cursor-pointer"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword
                      ? <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
                <div className="w-full">
                  <label className="text-xs font-semibold text-[#2A6F97] uppercase mb-1 block">Role *</label>
                  <Select value={form.role} onValueChange={value => setForm(f => ({ ...f, role: value }))}>
                    <SelectTrigger className="w-full bg-white border border-[#E0E7EF] rounded-lg px-3 py-2 text-base text-[#111111] font-medium">
                      <SelectValue placeholder="Selecione a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2 mt-4">
                  <button className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg font-medium" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
                  <button className="bg-gray-200 px-4 py-2 rounded-lg font-medium" onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarPerfis;
