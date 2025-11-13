import { Router } from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/usersController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de usuários requerem autenticação e permissão de admin
router.use(authMiddleware, adminMiddleware);

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
