import { rechargeSchema } from './../schemas/rechargeSchema.js';
import { Router } from "express";
import * as rechargeController from "../controllers/rechargeController.js";
import validateSchemaMiddleware from "../utils/validateSchemaMiddleware.js";
var rechargeRouter = Router();
rechargeRouter.post('/recharges', validateSchemaMiddleware(rechargeSchema), rechargeController.insertRecharge);
export default rechargeRouter;
