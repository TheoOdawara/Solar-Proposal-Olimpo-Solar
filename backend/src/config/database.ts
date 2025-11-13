import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões PostgreSQL:', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Query executada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', { text, error });
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL estabelecida:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
};
