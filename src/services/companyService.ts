import * as companyRepository from "../repositories/companyRepository.js";
import * as errors from "../utils/errorFunctions.js";

export async function validateApiKeys (key: string) {
    const company = await companyRepository.findByApiKey(key);
    if (!company) throw errors.notFoundError("company");
}