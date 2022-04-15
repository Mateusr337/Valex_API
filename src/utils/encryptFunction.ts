import bcrypt from "bcrypt";

export default function encryptData (data: any) {
    const encrypted = bcrypt.hashSync(data, 10);
    return encrypted;
}