'@faker-js/faker';
import * as cardRepository from '../repositories/cardRepository.js';
import * as errors from "./errorFunctions.js";
import dayjs from 'dayjs';

export default async function validateIsCardActive(id: number, isActivation: boolean) {
    const cardFound = await cardRepository.findById(id);
    if (!cardFound) throw errors.notFoundError('card');

    const dateToday = `${dayjs().format('MM')}/${dayjs().format('YY')}`;
    if (cardFound.expirationDate < dateToday) throw errors.unauthorizedError('creditCard');

    if (cardFound.password && isActivation) throw errors.unauthorizedError('creditCardId');
}