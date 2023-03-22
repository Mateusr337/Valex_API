import * as errors from "./errorFunctions.js";
function validateSchemaMiddleware(schema) {
    return function (req, res, next) {
        var validation = schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            var errorsMessage = validation.error.details.map(function (detail) { return detail.message; });
            throw errors.badRequestError(errorsMessage.join('; '));
        }
        next();
    };
}
export default validateSchemaMiddleware;
