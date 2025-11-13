import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { testConnection } from './config/database';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Rota 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Testar conexão com banco
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }

    // Iniciar servidor HTTP
    app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`📍 Ambiente: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
