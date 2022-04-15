import { Request, Response } from "express";
import * as companyService from "../services/companyService.js";
import * as cardsService from "../services/cardsService.js";

export async function createCards (req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    const { cardFlag } = req.body;

    await companyService.validateApiKeys(apiKey);
    await cardsService.createCards(req.body, cardFlag);

    res.sendStatus(201);
}

export async function activateCard (req: Request, res: Response) {

    

    res.sendStatus(201);
}