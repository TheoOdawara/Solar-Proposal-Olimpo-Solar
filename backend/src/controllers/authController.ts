import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { generateToken } from '../utils/jwt';
import { config } from '../config';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    // Validar campos
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, senha e nome completo são obrigatórios' });
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

    // Atualizar profile com full_name
    await pool.query('UPDATE profiles SET full_name = $1 WHERE id = $2', [full_name, user.id]);

    // Buscar role
    const roleResult = await pool.query('SELECT role FROM user_roles WHERE user_id = $1', [user.id]);
    const role = roleResult.rows[0]?.role || 'cliente';

    // Gerar token
    const token = generateToken({ userId: user.id, email: user.email, role });

    // Set token as HttpOnly cookie so frontend can call /me with credentials
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        full_name,
        role,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, p.full_name, ur.role
       FROM users u
       JOIN profiles p ON p.id = u.id
       JOIN user_roles ur ON ur.user_id = u.id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = result.rows[0];

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    // Set token as HttpOnly cookie for subsequent requests
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const result = await pool.query(
      `SELECT u.id, u.email, p.full_name, ur.role, u.created_at
       FROM users u
       JOIN profiles p ON p.id = u.id
       JOIN user_roles ur ON ur.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  // Clear cookie set at login
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true });
};
