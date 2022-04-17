import { faker } from '@faker-js/faker';
import * as cardRepository from './../repositories/cardRepository.js';
import * as employeeService from "../services/employeeService.js";
import * as paymentsRepository from "../repositories/paymentRepository.js";
import * as rechargesRepository from "../repositories/rechargeRepository.js";
import * as errors from "../utils/errorFunctions.js";
import dayjs from 'dayjs';
import * as encryptFunction from '../utils/encryptFunction.js';
import balanceCalculator from '../utils/balanceCalculator.js';
import validatePasswordLength from '../utils/validatePasswordLength.js';


export async function createCards(
        type: cardRepository.TransactionTypes,
        employeeId: number,
) {
    const employee = await employeeService.findEmployeeById(employeeId);
    await validateCardType(type, employeeId);

    const creditCardData = await createHandleCardData("mastercard");
    const cardholderName = await employeeService.formatNameUserById(employee);

    await cardRepository.insert({
        employeeId,
        cardholderName,
        ...creditCardData,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type,
    });
}

export async function createVirtualCard(
    id: number,
    password: string,
) {
    const originalCard = await findCardById(id);
    await encryptFunction.compareEncrypted(password, originalCard.password);

    const creditCardData = await createHandleCardData("mastercard");

    await cardRepository.insert({
        employeeId: originalCard.employeeId,
        cardholderName: originalCard.cardholderName,
        ...creditCardData,
        password: originalCard.password,
        isVirtual: true,
        originalCardId: originalCard.id,
        isBlocked: false,
        type: originalCard.type,
    });
}

export async function activateCards (
    password: string,
    cardId: number,
    CVC: string,
) {
    const card = await findCardById(cardId);
    if (card.isVirtual) throw errors.unauthorizedError("card");

    validatePasswordLength(password);
    await validateIsCardActive(card, true);
    await encryptFunction.compareEncrypted(CVC, card.securityCode);

    const passwordEncrypted = encryptFunction.encryptData(password);

    await cardRepository.update(
        cardId, 
        {
            password: passwordEncrypted,
            isBlocked: false,
        }
    );
}

export async function getCardOperationsById (cardId: number) {

    const card = await findCardById(cardId);
    await validateIsCardActive(card, false);

    const transactions: paymentsRepository.Payment[] = await paymentsRepository.findByCardId(cardId);
    const recharges: rechargesRepository.Recharge[] = await rechargesRepository.findByCardId(cardId);
    
    const balance = balanceCalculator(recharges, transactions);

    return {
        balance,
        transactions,
        recharges,
    };
}

export async function blockUnlockCard (
    id: number, 
    password: string, 
    block: string
) {
    const card = await findCardById(id);
    await validateIsCardActive(card, false);

    await encryptFunction.compareEncrypted(password, card.password);

    const blockValue = validateBlock(block, card);
    await cardRepository.update(card.id, { isBlocked: blockValue });
}

function validateBlock(
    block: string, 
    card: cardRepository.Card
) {
    const blockOptions = ["block", "unlock"];
    if (!blockOptions.includes(block)) throw errors.badRequestError("block type must be 'block' or 'unlock'");

    if (card.isBlocked && block === "block") throw errors.unauthorizedError("card is blocked");
    if (!card.isBlocked && block === "unlock") throw errors.unauthorizedError("card is unlocked");

    const blockValue = block === "block" ? true : false;
    return blockValue;
}

export async function findCardById(id: number) {

    const cardFound = await cardRepository.findById(id);
    if (!cardFound) throw errors.notFoundError('card');

    return cardFound;
}


async function createHandleCardData(cardFlag: string) {

    let existCreditCard: string;
    let creditCard: any;

    const ValidityYear = parseInt(dayjs().format(`YY`)) + 5;
    const validityMonth = dayjs().format(`MM`);

    do {
        creditCard = {
            number: faker.finance.creditCardNumber(cardFlag.toLowerCase()),
            securityCode: faker.finance.creditCardCVV().toString(),
            expirationDate: `${validityMonth}/${ValidityYear}`,
        };

        existCreditCard = await cardRepository.findByCardNumber(creditCard.cardNumber);
    } while (existCreditCard);

    creditCard.securityCode = encryptFunction.encryptData(creditCard.securityCode);

    return creditCard;
}

export async function validateIsCardActive(
    card: cardRepository.Card, 
    isActivation: boolean
) {
    const dateToday = `${dayjs().format('MM')}/${dayjs().format('YY')}`;
    if (card.expirationDate < dateToday) throw errors.unauthorizedError('creditCard');

    if (card.password && isActivation) throw errors.unauthorizedError('creditCardId');
}

async function validateCardType(type: cardRepository.TransactionTypes, employeeId: number) {
    const arrayCardsTypes = [
        'groceries',
        'restaurant',
        'transport',
        'education',
        'health',
    ];

    if (!arrayCardsTypes.includes(type)) {
        throw errors.badRequestError('cardType');
    }

    const hasCardThisType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (hasCardThisType) throw errors.badRequestError('Type card already exist to this employee');
}

export async function findByCardDetails (
    cardData: cardRepository.CardDataToOnlinePayment,
) {
    const {
        number,
        cardholderName,
        expirationDate,
    } = cardData;

    const foundCard = await cardRepository.findByCardDetails(
        number,
        cardholderName,
        expirationDate,
    );
    if (!foundCard) throw errors.notFoundError("card");
    return foundCard;
}

export async function deleteCards (
    id: number,
    password: string,
) {
    const card = await findCardById(id);

    if (!card.isVirtual) throw errors.unauthorizedError("card");
    encryptFunction.compareEncrypted(password, card.password);
    
    await cardRepository.remove(id);
}

