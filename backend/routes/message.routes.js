import express from 'express';
import { processMessage, enrichMessage } from '../controllers/message.controller.js';

const router = express.Router();

/**
 * POST /api/v2/mensaje
 * Recibe mensaje con entidades previas y agrega Order (entidad C)
 * Req body: { entidadA: {...}, entidadB: {...}, metadata: {...} }
 */
router.post('/', processMessage);

/**
 * POST /api/v2/mensaje/enrich
 * Versión mejorada que permite especificar qué orden agregar
 * Req body: { previousEntities: {...}, orderId?: "..." }
 */
router.post('/enrich', enrichMessage);

export default router;
