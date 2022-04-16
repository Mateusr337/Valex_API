import { Request, Response } from "express";
import * as companyService from "../services/companyService.js";
import * as cardsService from "../services/cardsService.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function createCards (req: Request, res: Response) {

    const apiKey = req.headers['x-api-key'].toString();
    const { type, employeeId } = req.body;

    await companyService.validateApiKeys(apiKey);
    await cardsService.createCards(type, employeeId);

    res.sendStatus(201);
}

export async function createVirtualCard (req: Request, res: Response) {

    const { id, password } = req.body;

    await cardsService.createVirtualCard(id, password);

    res.sendStatus(201);
}

export async function activateCard (req: Request, res: Response) {

    const {
        password,
        cardId,
        CVC
    } = req.body;

    await cardsService.activateCards(password, cardId, CVC);
    res.sendStatus(201);
}

export async function getCardById (req: Request, res: Response) {

    const cardId: number = parseInt(req.params.cardId);
    const cardData: any = await cardsService.getCardOperationsById(cardId);

    res.send(cardData || {});
}

export async function blockUnlockCard (req: Request, res: Response) {

    const { password, id }: cardRepository.CardUpdateData = req.body;
    const { block } = req.params;
    await cardsService.blockUnlockCard(id, password, block);

    res.sendStatus(201);
}