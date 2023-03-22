import * as errors from "../utils/errorFunctions.js";
export default function validatePasswordLength(password) {
    var verify = /^[0-9]{4}$/.test(password);
    if (!verify)
        throw errors.badRequestError('password must have 4 numbers');
}
