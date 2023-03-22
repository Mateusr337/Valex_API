import joi from 'joi';
export var activateCardSchema = joi.object({
    cardId: joi.number().integer().required(),
    CVC: joi.string().required().pattern(new RegExp('^[0-9]{3}$')),
    password: joi.string().required()
});
