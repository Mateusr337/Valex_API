import { Router } from 'express';
import * as controllers from '../controllers/cardsController.js';

const cardsRouter = Router();

cardsRouter.post('/cards', controllers.createcards);

export default cardsRouter;