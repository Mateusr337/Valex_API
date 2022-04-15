import bcrypt from "bcrypt";

export function encryptData (data: string) {
    const encrypted = bcrypt.hashSync(data, 10);
    return encrypted;
}

export async function compareEncrypted (data: string, hash: string) {
    return await bcrypt.compare(data, hash);
}