import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService.js";


export async function insertPayments (req: Request, res: Response) {

    const {
        password, 
        cardData
    } = req.body;

    const payment = {
        amount: req.body.amount,
        businessId: req.body.businessId,
        cardId: req.body.cardId,
    };

    await paymentsService.insertPayments(payment, password, cardData);
    res.sendStatus(201);
}