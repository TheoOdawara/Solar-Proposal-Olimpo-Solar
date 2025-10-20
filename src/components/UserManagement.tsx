import React, { useState, useEffect } from 'react';

// Componente para mostrar papel do usuário
const RoleCell = ({ userId }) => {
  const [role, setRole] = useState('');
  useEffect(() => {
    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      if (!error && data?.role) setRole(data.role);
    };
    fetchRole();
  }, [userId]);
  return <span className="px-2 py-1 rounded bg-gray-100 text-xs">{role || 'user'}</span>;
};
import { supabase } from '@/integrations/supabase/client';

export const UserManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [roleEdit, setRoleEdit] = useState('user');
  const [newUser, setNewUser] = useState({ full_name: '', email: '' });

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      if (!error) setProfiles(data || []);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.email?.toLowerCase().includes(filter.toLowerCase())
  );

  // Editar papel do usuário
  const handleEditRole = async () => {
    if (!selectedUser) return;
    await supabase
      .from('user_roles')
      .update({ role: roleEdit })
      .eq('user_id', selectedUser.id);
    setShowEditModal(false);
    setSelectedUser(null);
    window.location.reload();
  };

  // Adicionar novo usuário
  const handleAddUser = async () => {
    if (!newUser.full_name || !newUser.email) return;
    // Cria perfil
    const { data: profile } = await supabase
      .from('profiles')
      .insert({ full_name: newUser.full_name, email: newUser.email })
      .select();
    // Cria role
    if (profile && profile[0]?.id) {
      await supabase
        .from('user_roles')
        .insert({ user_id: profile[0].id, role: 'user' });
    }
    setShowAddModal(false);
    setNewUser({ full_name: '', email: '' });
    window.location.reload();
  };

  // Remover usuário
  const handleRemoveUser = async () => {
    if (!selectedUser) return;
    await supabase.from('user_roles').delete().eq('user_id', selectedUser.id);
    await supabase.from('profiles').delete().eq('id', selectedUser.id);
    setShowRemoveModal(false);
    setSelectedUser(null);
    window.location.reload();
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
