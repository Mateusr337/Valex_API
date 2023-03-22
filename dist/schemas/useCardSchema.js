import joi from "joi";
var UseCardSchema = joi.object({
    id: joi.number().integer().required(),
    password: joi.string().required()
});
export default UseCardSchema;
