import { Router } from "express";
import * as rechargeController from "../controllers/rechargeController";


const rechargeRouter = Router();

rechargeRouter.post('/recharges', rechargeController.insertRecharge);

export default rechargeRouter;