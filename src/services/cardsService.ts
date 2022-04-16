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
    {
        type,
        employeeId,
        isVirtual,
        originalCardId,
    }: cardRepository.CardInsertData,
    cardFlag: string,
) {

    await employeeService.validateEmployeeById(employeeId);
    await validateCardType(type, employeeId);
    validateVirtualCard(isVirtual, originalCardId);

    if (cardFlag.toLowerCase() !== "mastercard") throw errors.badRequestError("cardFlag");
    const creditCardData = await createHandleCardData(cardFlag);
    const cardholderName = await employeeService.formatNameUserById(employeeId);

    await cardRepository.insert({
        employeeId,
        cardholderName,
        ...creditCardData,
        password: null,
        isVirtual: isVirtual || false,
        originalCardId: originalCardId || null,
        isBlocked: true,
        type,
    });
}

export async function activateCards (
    password: string,
    cardId: number,
    CVC: string,
) {
    validatePasswordLength(password);
    await validateIsCardActive(cardId, true);
    await validateCVC(cardId, CVC);

    const passwordEncrypted = encryptFunction.encryptData(password);

    await cardRepository.update(
        cardId, 
        {
            password: passwordEncrypted,
            isBlocked: false,
        }
    );
}

export async function getCardById (cardId: number) {

    await validateIsCardActive(cardId, false);

    const transactions: paymentsRepository.Payment[] = await paymentsRepository.findByCardId(cardId);
    const recharges: rechargesRepository.Recharge[] = await rechargesRepository.findByCardId(cardId);
    
    const balance = balanceCalculator(recharges, transactions);

    return {
        balance,
        transactions,
        recharges,
    };
}

async function validateCVC (id: number, CVC: string) {

    const cardFound = await cardRepository.findById(id);
    if (!cardFound) throw errors.notFoundError('card');

    const match = await encryptFunction.compareEncrypted(CVC, cardFound.securityCode);
    if (!match) throw errors.unauthorizedError('creditCard');
}

function validateVirtualCard(isVirtual: boolean, originalCardId: number) {

    if (isVirtual || originalCardId) {
        if (!isVirtual || !originalCardId) {
            throw errors.badRequestError(`if it is a virtual card it must have "isVirtual"(true) and "originalCardId"`);
        }
    }
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

export async function validateIsCardActive(id: number, isActivation: boolean) {
    const cardFound = await cardRepository.findById(id);
    if (!cardFound) throw errors.notFoundError('card');

    const dateToday = `${dayjs().format('MM')}/${dayjs().format('YY')}`;
    if (cardFound.expirationDate < dateToday) throw errors.unauthorizedError('creditCard');

    if (cardFound.password && isActivation) throw errors.unauthorizedError('creditCardId');
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

