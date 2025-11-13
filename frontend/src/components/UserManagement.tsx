import React, { useState, useEffect } from 'react';

// Componente para mostrar papel do usuário
import { apiClient, ApiResponse } from '@/integrations/api/client';

type Profile = { id: string; full_name?: string; email?: string; created_at?: string };

const RoleCell = ({ userId }: { userId: string }) => {
  const [role, setRole] = useState<string>('');
  useEffect(() => {
    const fetchRole = async () => {
      // call eq before select to match the shim's expected chaining (eq returns the query builder)
  const resp = await apiClient.from('user_roles').eq('user_id', userId).select('user_id,role') as ApiResponse<Array<{ user_id: string; role: string }>>;
  const rows = resp?.data ?? [];
      const r = Array.isArray(rows) && rows.length > 0 ? rows[0].role : undefined;
      if (r) setRole(r);
    };
    fetchRole();
  }, [userId]);
  return <span className="px-2 py-1 rounded bg-gray-100 text-xs">{role || 'user'}</span>;
};
// Note: this component uses the API compatibility client (`apiClient`).

export const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [roleEdit, setRoleEdit] = useState<string>('user');
  const [newUser, setNewUser] = useState<{ full_name: string; email: string }>({ full_name: '', email: '' });

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
  const resp = await apiClient.from('profiles').select('id, full_name, email') as ApiResponse<Profile[]>;
  if (resp.error) {
        console.error('Error fetching profiles:', resp.error);
        setProfiles([]);
      } else {
        const data = resp?.data ?? [];
        setProfiles(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter((p) => {
    const q = filter.toLowerCase();
    return (p.full_name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q);
  });

  // Editar papel do usuário
  const handleEditRole = async () => {
    if (!selectedUser) return;
    // call eq before update to match shim
    const resp = await apiClient.from('user_roles').eq('user_id', selectedUser.id).update({ role: roleEdit }) as ApiResponse<unknown>;
    if (resp.error) {
      console.error('Error updating role:', resp.error);
    }
    setShowEditModal(false);
    // update local state instead of reloading
    setProfiles((prev) => prev.map((p) => (p.id === selectedUser.id ? { ...p } : p)));
    setSelectedUser(null);
  };

  // Adicionar novo usuário
  const handleAddUser = async () => {
    if (!newUser.full_name || !newUser.email) return;
    // Cria perfil
  const resp = await apiClient.from('profiles').insert({ full_name: newUser.full_name, email: newUser.email }) as ApiResponse<Profile[] | Profile>;
  if (resp.error) {
      console.error('Error creating profile:', resp.error);
      setShowAddModal(false);
      return;
    }
  const profile = resp?.data ?? null;
    // Cria role
    let newId: string | undefined;
    if (Array.isArray(profile)) {
      newId = profile[0]?.id;
    } else {
      newId = (profile as Profile | null)?.id;
    }
    if (newId) {
      const roleResp = await apiClient.from('user_roles').insert({ user_id: newId, role: 'user' }) as ApiResponse<unknown>;
      if (roleResp.error) console.error('Error creating user role:', roleResp.error);
      setProfiles((prev) => [...prev, { id: newId, full_name: newUser.full_name, email: newUser.email }]);
    }
    setShowAddModal(false);
    setNewUser({ full_name: '', email: '' });
  };

  // Remover usuário
  const handleRemoveUser = async () => {
    if (!selectedUser) return;
    const delRoleResp = await apiClient.from('user_roles').eq('user_id', selectedUser.id).delete() as ApiResponse<null>;
    if (delRoleResp.error) console.error('Error deleting user role:', delRoleResp.error);
    const delProfileResp = await apiClient.from('profiles').eq('id', selectedUser.id).delete() as ApiResponse<null>;
    if (delProfileResp.error) console.error('Error deleting profile:', delProfileResp.error);
    setShowRemoveModal(false);
    setProfiles((prev) => prev.filter((p) => p.id !== selectedUser.id));
    setSelectedUser(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Gerenciar Perfis</h2>
      <div className="flex gap-2 mb-4">
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowAddModal(true)}>Adicionar usuário</button>
        <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => setShowRemoveModal(true)}>Remover usuário</button>
      </div>
      <input
        type="text"
        placeholder="Filtrar por nome ou e-mail"
        className="border rounded px-2 py-1 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">E-mail</th>
              <th className="border px-2 py-1">Papel</th>
              <th className="border px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.full_name}</td>
                <td className="border px-2 py-1">{p.email}</td>
                <td className="border px-2 py-1"><RoleCell userId={p.id} /></td>
                <td className="border px-2 py-1">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => { setSelectedUser(p); setShowEditModal(true); }}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded ml-2" onClick={() => { setSelectedUser(p); setShowRemoveModal(true); }}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal editar papel */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-2">Editar papel</h3>
            <div className="mb-4">Usuário: <b>{selectedUser.full_name}</b></div>
            <select className="border rounded px-2 py-1 w-full mb-4" value={roleEdit} onChange={e => setRoleEdit(e.target.value)}>
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleEditRole}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionar usuário */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-2">Adicionar usuário</h3>
            <input
              type="text"
              placeholder="Nome completo"
              className="border rounded px-2 py-1 w-full mb-2"
              value={newUser.full_name}
              onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="E-mail"
              className="border rounded px-2 py-1 w-full mb-4"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleAddUser}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal remover usuário */}
      {showRemoveModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-2">Remover usuário</h3>
            <div className="mb-4">Tem certeza que deseja remover <b>{selectedUser.full_name}</b>?</div>
            <div className="flex gap-2 justify-end">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowRemoveModal(false)}>Cancelar</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleRemoveUser}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
