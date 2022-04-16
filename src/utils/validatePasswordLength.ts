import * as errors from "../utils/errorFunctions.js";

export default function validatePasswordLength(password: string) {

    const verify = /^[0-9]{4}$/.test(password);
    if (!verify) throw errors.badRequestError('password must have 4 numbers');
}