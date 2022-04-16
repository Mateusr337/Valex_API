import joi from "joi";

const UseCardSchema = joi.object({
    id: joi.number().integer().required(),
    password: joi.string().required(),
});

export default UseCardSchema;