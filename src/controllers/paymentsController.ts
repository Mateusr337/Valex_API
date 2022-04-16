import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService.js";


export async function insertPayments (req: Request, res: Response) {

    const { password } = req.body;

    await paymentsService.insertPayments(req.body, password);
    res.sendStatus(201);
}