import { Request, Response } from "express";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyService from "../services/companyService.js";
import * as rechargeService from "../services/rechargeService.js";


export async function insertRecharge (req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    const { cardId, amount }: rechargeRepository.Recharge = req.body; 

    await companyService.validateApiKeys(apiKey);
    await rechargeService.insertRecharge(cardId, amount);

    res.sendStatus(201);
}