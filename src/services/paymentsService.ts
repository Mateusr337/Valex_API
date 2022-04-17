import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardService from "../services/cardsService.js";
import * as businessService from "../services/businessService.js";
import * as encryptFunctions from "../utils/encryptFunction.js";
import * as errors from "../utils/errorFunctions.js";
import * as cardRepository from './../repositories/cardRepository.js';


export async function insertPayments(
    payment: paymentRepository.PaymentInsertData, 
    password: string,
    cardData: cardRepository.CardDataToOnlinePayment,
) {
    const {
        cardId,
        amount,
        businessId,
    } = payment;

    if (amount <= 0) throw errors.badRequestError('"amount" must be greater than zero');
    
    const card = await cardService.findCardById(cardId);
    await cardService.validateIsCardActive(card, false);

    await validateBusinessType(businessId, card);

    let originalCard: cardRepository.Card;
    if (cardData) {
        originalCard = await validatePaymentOnline(card, cardData);
    } else {
        originalCard =  await validatePaymentPOS(card, password);
    }

    const { balance } = await cardService.getCardOperationsById(originalCard.id);
    if (balance < amount) throw errors.badRequestError("insufficient balance");

    await paymentRepository.insert({
        cardId: originalCard.id, 
        businessId, 
        amount 
    });
}

async function validatePaymentPOS (
    card: cardRepository.Card,
    password: string,
) {
    if (card.isBlocked || card.isVirtual) throw errors.unauthorizedError("card");
    await encryptFunctions.compareEncrypted(password, card.password);

    return card;
}

async function validatePaymentOnline(
    virtualCard: cardRepository.Card,
    cardData: cardRepository.CardDataToOnlinePayment,
) {
    await cardService.findByCardDetails(cardData);
    await encryptFunctions.compareEncrypted(cardData.securityCode, virtualCard.securityCode);

    const originalCard = await cardService.findCardById(virtualCard.originalCardId);
    return originalCard;
}

async function validateBusinessType (
    businessId: number, 
    card: cardRepository.Card,
) {

    const business = await businessService.findBusinessById(businessId);
    if (business.type !== card.type) throw errors.unauthorizedError("buy at this establishment");
}