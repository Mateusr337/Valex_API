import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardService from "../services/cardsService.js";
import * as encryptFunctions from "../utils/encryptFunction.js";
import * as errors from "../utils/errorFunctions.js";
import validateIsCardActive from "../utils/validateIsCardActive.js";
import * as cardRepository from './../repositories/cardRepository.js';


export async function insertPayments(
    payment: paymentRepository.Payment, 
    password: string,
) {
    const {
        cardId,
        amount,
        businessId,
    } = payment;

    if (amount <= 0) throw errors.badRequestError('"amount" must be greater than zero');

    await validateIsCardActive(cardId, false);
    await validatePassword(password, cardId);
    await validateBusinessAndType(businessId, cardId);

    const { balance } = await cardService.getCardById(cardId);
    if (balance < amount) throw errors.badRequestError("insufficient balance");

    await paymentRepository.insert({ cardId, businessId, amount });
}

async function validateBusinessAndType (businessId: number, cardId: number) {

    const business = await businessRepository.findById(businessId);
    if (!business) throw errors.notFoundError("business");

    const cardFound = await cardRepository.findById(cardId);
    if (!cardFound) throw errors.notFoundError('card');

    if (business.type !== cardFound.type) throw errors.unauthorizedError("buy at this establishment");
}

async function validatePassword(password: string, cardId: number) {

    const cardFound = await cardRepository.findById(cardId);
    if (!cardFound) throw errors.notFoundError('card');

    const match = await encryptFunctions.compareEncrypted(password, cardFound.password);
    if (!match) throw errors.unauthorizedError("invalid password");
}