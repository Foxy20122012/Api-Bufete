import { Router } from 'express';
import { dataController } from '../controllers/spr.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/data', dataController);

export default router;
