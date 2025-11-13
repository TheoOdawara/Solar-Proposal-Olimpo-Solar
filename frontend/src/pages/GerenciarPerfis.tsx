import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Edit, Plus, Search, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Navigate } from 'react-router-dom';
import {
  listProfiles,
  createUser,
  updateProfile,
  deleteUser,
  validateEmail,
  UserWithRole,
  CreateUserData,
  UpdateUserData
} from '@/integrations/api/profiles';

type FormMode = 'create' | 'edit';

export default function GerenciarPerfis() {
  const { toast } = useToast();
  const { hasAdminAccess, loading: adminLoading } = useAdminAccess();

  const [profiles, setProfiles] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [filterRole, setFilterRole] = useState<string>('todos');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>('create');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: '' as 'administrador' | 'vendedor' | 'cliente' | '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null);

  
  const loadProfiles = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log('📥 Carregando perfis...');
      const data = await listProfiles();
      console.log('✅ Perfis carregados:', data.length, 'usuários');
      setProfiles(data);
    } catch (error) {
      console.error('❌ Erro ao carregar perfis:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao carregar lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Só carrega perfis se for admin
    if (hasAdminAccess && !adminLoading) {
      loadProfiles();
    } else if (!adminLoading && !hasAdminAccess) {
      setLoading(false);
    }
  }, [hasAdminAccess, adminLoading, loadProfiles]);
  

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchName = profile.full_name.toLowerCase().includes(searchName.toLowerCase());
      const matchEmail = profile.email.toLowerCase().includes(searchEmail.toLowerCase());
      const matchRole = filterRole === 'todos' || profile.role === filterRole;
      return matchName && matchEmail && matchRole;
    });
  }, [profiles, searchName, searchEmail, filterRole]);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      email: '',
      full_name: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: UserWithRole) => {
    setModalMode('edit');
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role as 'administrador' | 'vendedor' | 'cliente',
      password: '',
      confirmPassword: ''
    });
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!formData.full_name || !formData.role) {
        toast({
          title: "Erro de validação",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }

      if (modalMode === 'create') {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          toast({
            title: "Erro de validação",
            description: "Preencha todos os campos obrigatórios",
            variant: "destructive"
          });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Erro de validação",
            description: "As senhas não conferem",
            variant: "destructive"
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Erro de validação",
            description: "A senha deve ter no mínimo 6 caracteres",
            variant: "destructive"
          });
          return;
        }

        const emailValid = await validateEmail(formData.email);
        if (!emailValid) {
          toast({
            title: "Erro de validação",
            description: "Email inválido",
            variant: "destructive"
          });
          return;
        }

        const newUserData: CreateUserData = {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role
        };

        await createUser(newUserData);
        
        toast({
          title: "Sucesso",
          description: "Usuário criado! Email de confirmação enviado.",
        });
      } else {
        if (!selectedUser) return;

        const updates: UpdateUserData = {
          full_name: formData.full_name,
          role: formData.role
        };

        await updateProfile(selectedUser.id, updates);

        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      }

      setShowModal(false);
      loadProfiles();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao salvar usuário",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user: UserWithRole) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      setShowDeleteDialog(false);
      setUserToDelete(null);
      loadProfiles();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao excluir usuário",
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setFilterRole('todos');
  };

  console.log('🔍 GerenciarPerfis renderizando - adminLoading:', adminLoading, 'hasAdminAccess:', hasAdminAccess);

  if (adminLoading) {
    console.log('⏳ GerenciarPerfis - Aguardando verificação de permissões...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    console.log('❌ GerenciarPerfis - SEM ACESSO ADMIN, redirecionando para /');
    return <Navigate to="/" replace />;
  }

  console.log('✅ GerenciarPerfis - Acesso permitido, renderizando página');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Gerenciar Perfis</CardTitle>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os perfis</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>

            {(searchName || searchEmail || filterRole !== 'todos') && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Nome</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Role</th>
                    <th className="text-left p-3 font-semibold">Data Criação</th>
                    <th className="text-right p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{profile.full_name}</td>
                      <td className="p-3">{profile.email}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profile.role === 'administrador' ? 'bg-blue-100 text-blue-800' :
                          profile.role === 'vendedor' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.role}
                        </span>
                      </td>
                      <td className="p-3">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(profile)}
                            className="gap-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(profile)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={modalMode === 'edit'}
                placeholder="usuario@exemplo.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nome Completo</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Perfil</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as 'administrador' | 'vendedor' | 'cliente' | '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {modalMode === 'create' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Confirmar Senha</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repita a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.full_name}</strong> ({userToDelete?.email})?
            </p>
            <p className="text-sm text-red-600 mt-2">
              Esta ação é irreversível.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
