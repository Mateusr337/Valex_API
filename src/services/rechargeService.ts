import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as errors from "../utils/errorFunctions.js";
import * as cardService from "../services/cardsService.js";



export async function insertRecharge (
    cardId: number,
    amount: number,
) {
    if (amount <= 0) throw errors.badRequestError('amount must be greater than zero');

    await cardService.validateIsCardActive(cardId, false);
    
    await rechargeRepository.insert({cardId, amount});
}