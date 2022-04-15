import { faker } from '@faker-js/faker';
import * as cardRepository from './../repositories/cardRepository.js';
import * as employeesRepository from "../repositories/employeeRepository.js";
import * as errors from "../utils/errorFunctions.js";
import validateId from '../utils/validateEmployeeId.js';
import dayjs from 'dayjs';
import encryptData from '../utils/encryptFunction.js';


export async function createCards(
    {
        type,
        employeeId,
        isVirtual,
        originalCardId,
    }: cardRepository.Card,
    cardFlag: string,
) {

    validateId(employeeId);
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

    creditCard.securityCode = encryptData(creditCard.securityCode);

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

