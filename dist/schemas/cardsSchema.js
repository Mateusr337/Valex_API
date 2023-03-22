import joi from 'joi';
export var cardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    type: joi.string().required()
});
