import { activateCardSchema } from './../schemas/activateCardSchema.js';
import { cardSchema } from '../schemas/cardsSchema.js';
import { Router } from 'express';
import * as cardController from '../controllers/cardsController.js';
import validateSchemaMiddleware from '../utils/validateSchemaMiddleware.js';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchemaMiddleware(cardSchema), cardController.createCards);
cardsRouter.patch('/cards/:cardId/activate', validateSchemaMiddleware(activateCardSchema), cardController.activateCard);
cardsRouter.get("/cards/:cardId", cardController.getCardById);

export default cardsRouter;