import { Request, Response } from "express";
import * as cardsService from "../services/cardsService.js";
import * as companyService from "../services/companyService.js";

export function createcards (req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    const { cardType } = req.body;

    companyService.validateApiKeys(apiKey);

    res.sendStatus(201);
}