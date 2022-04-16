import joi from "joi";

const onlinePaymentsSchema = joi.object({
    cardId: joi.number().integer().required(),
    amount: joi.number().integer().required(),
    businessId: joi.number().integer().required(),
    cardData: joi.object({
        securityCode: joi.string().required().pattern(/^[0-9]{3}$/),
        number: joi.string().required().pattern(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/),
        cardholderName: joi.string().required(),
        expirationDate: joi.date().required(),
    }).required(),
});

export default onlinePaymentsSchema;