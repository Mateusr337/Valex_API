import joi from "joi";
export var rechargeSchema = joi.object({
    cardId: joi.number().integer().required(),
    amount: joi.number().integer().required()
});
