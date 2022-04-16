import joi from 'joi';

const paymentsSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().required(),
    amount: joi.number().integer().required(),
    businessId: joi.number().integer().required(),
});

export default paymentsSchema;