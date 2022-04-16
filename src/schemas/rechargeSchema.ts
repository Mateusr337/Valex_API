import joi from "joi";

export const rechargeSchema = joi.object({
    cardId: joi.number().integer().required(),
    amount: joi.number().integer().required(),
});