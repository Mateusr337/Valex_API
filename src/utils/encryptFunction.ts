import bcrypt from "bcrypt";
import * as errorFunction from "./errorFunctions.js";

export function encryptData (data: string) {
    const encrypted = bcrypt.hashSync(data, 10);
    return encrypted;
}

export async function compareEncrypted (data: string, hash: string) {
    const match = await bcrypt.compare(data, hash);
    if (!match) throw errorFunction.unauthorizedError("password invalid");
}