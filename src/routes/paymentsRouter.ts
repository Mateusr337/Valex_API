import { Router } from "express";
import * as paymentsController from "../controllers/paymentsController.js";
import paymentsSchema from "../schemas/paymentsSchema.js";
import validateSchemaMiddleware from "../utils/validateSchemaMiddleware.js";

const paymentsRouter = Router();

paymentsRouter.post("/payments", validateSchemaMiddleware(paymentsSchema), paymentsController.insertPayments);

export default paymentsRouter;