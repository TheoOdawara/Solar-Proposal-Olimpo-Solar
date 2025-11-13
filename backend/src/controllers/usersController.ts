import { Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { AuthRequest } from '../middlewares/auth';

export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, p.full_name, ur.role, u.created_at
       FROM users u
       JOIN profiles p ON p.id = u.id
       JOIN user_roles ur ON ur.user_id = u.id
       ORDER BY u.created_at DESC`
    );

    return res.json({ users: result.rows });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Validar campos
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validar role
    const validRoles = ['administrador', 'vendedor', 'cliente'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role inválido' });
    }

    // Verificar se email já existe
    const checkUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, 10);

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    );

    const user = result.rows[0];

    // Atualizar profile
    await pool.query('UPDATE profiles SET full_name = $1, email = $2 WHERE id = $3', [
      full_name,
      email,
      user.id,
    ]);

    // Atualizar role se diferente de cliente
    if (role !== 'cliente') {
      await pool.query('UPDATE user_roles SET role = $1 WHERE user_id = $2', [role, user.id]);
    }

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        full_name,
        role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, full_name, role, password } = req.body;

    // Verificar se usuário existe
    const checkUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar email se fornecido
    if (email) {
      // Verificar se email já está em uso por outro usuário
      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [
        email,
        id,
      ]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
      await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, id]);
    }

    // Atualizar senha se fornecida
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);
    }

    // Atualizar profile
    if (full_name || email) {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (full_name) {
        updates.push(`full_name = $${paramCount++}`);
        values.push(full_name);
      }
      if (email) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
      }
      values.push(id);

      if (updates.length > 0) {
        await pool.query(`UPDATE profiles SET ${updates.join(', ')} WHERE id = $${paramCount}`, values);
      }
    }

    // Atualizar role
    if (role) {
      const validRoles = ['administrador', 'vendedor', 'cliente'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Role inválido' });
      }
      await pool.query('UPDATE user_roles SET role = $1 WHERE user_id = $2', [role, id]);
    }

    // Buscar usuário atualizado
    const result = await pool.query(
      `SELECT u.id, u.email, p.full_name, ur.role, u.created_at
       FROM users u
       JOIN profiles p ON p.id = u.id
       JOIN user_roles ur ON ur.user_id = u.id
       WHERE u.id = $1`,
      [id]
    );

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se usuário existe
    const checkUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Não permitir deletar a si mesmo
    if (req.user?.userId === id) {
      return res.status(400).json({ error: 'Você não pode deletar sua própria conta' });
    }

    // Deletar usuário (CASCADE vai deletar profile e role automaticamente)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    return res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
