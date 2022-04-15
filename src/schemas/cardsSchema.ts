import joi from 'joi';

export const cardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    type: joi.string().required(),
    cardFlag: joi.string().required(),
    isVirtual: joi.boolean(),
    originalCardId: joi.number().integer(),
});