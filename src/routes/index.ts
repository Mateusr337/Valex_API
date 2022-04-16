import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import rechargeRouter from "./rechargeRouter.js";

const router = Router();

router.use(cardsRouter);
router.use(rechargeRouter);

export default router;