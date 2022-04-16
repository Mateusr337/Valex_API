import { faker } from '@faker-js/faker';
import * as cardRepository from './../repositories/cardRepository.js';
import * as employeesRepository from "../repositories/employeeRepository.js";
import * as paymentsRepository from "../repositories/paymentRepository.js";
import * as rechargesRepository from "../repositories/rechargeRepository.js";
import * as errors from "../utils/errorFunctions.js";
import validateId from '../utils/validateEmployeeId.js';
import dayjs from 'dayjs';
import * as encryptFunction from '../utils/encryptFunction.js';
import validateIsCardActive from '../utils/validateIsCardActive.js';


export async function createCards(
    {
        type,
        employeeId,
        isVirtual,
        originalCardId,
    }: cardRepository.Card,
    cardFlag: string,
) {

    await validateId(employeeId);
    await validateCardType(type, employeeId);
    validateVirtualCard(isVirtual, originalCardId);

    if (cardFlag.toLowerCase() !== "mastercard") throw errors.badRequestError("cardFlag");
    const creditCardData = await createHandleCardData(cardFlag);
    const cardholderName = await formatNameUserById(employeeId);

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
    validatePassword(password);
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
    
    const balance: number = balanceCalculator(recharges, transactions);

    return {
        balance,
        transactions,
        recharges,
    };
}

function balanceCalculator(
    recharges: rechargesRepository.Recharge[], 
    payments: paymentsRepository.Payment[],
) {
    const rechargesAmount: number = recharges.reduce((rechargesAmount, recharge) => (
        rechargesAmount + recharge.amount
    ), 0);

    const paymentsAmount: number = payments.reduce((paymentsAmount, payment) => (
        paymentsAmount + payment.amount
    ), 0);

    return rechargesAmount - paymentsAmount;
}

function validatePassword(password: string) {

    const verify = /^[0-9]{4}$/.test(password);
    if (!verify) throw errors.badRequestError('password must have 4 numbers');
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

async function formatNameUserById (id: number) {

    const { fullName } = await employeesRepository.findById(id);
    const arrayNames = fullName.split(' ').filter(name => name.length >= 3);

    const cardName = arrayNames.map((name, i) => {
        if (i === 0 || i === arrayNames.length -1) return name;
        return name[0]; 
    });

    const formattedName = cardName.join(' ').toLocaleUpperCase();
    return formattedName;
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

async function validateCardType(type: string, employeeId: number) {
    const arrayCardsTypes = [
        'groceries',
        'restaurant',
        'transport',
        'education',
        'health'
    ];

    if (!arrayCardsTypes.includes(type)) {
        throw errors.badRequestError('cardType');
    }

    const hasCardThisType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (hasCardThisType) throw errors.badRequestError('Type card already exist to this employee');
}

