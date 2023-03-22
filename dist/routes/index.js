import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import paymentsRouter from "./paymentsRouter.js";
import rechargeRouter from "./rechargeRouter.js";
var router = Router();
router.use(cardsRouter);
router.use(rechargeRouter);
router.use(paymentsRouter);
export default router;
