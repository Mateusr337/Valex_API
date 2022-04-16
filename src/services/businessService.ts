import * as businessRepository from "../repositories/businessRepository.js";
import * as errorFunction from "../utils/errorFunctions.js";

export async function findBusinessById (id) {
    const business = await businessRepository.findById(id);
    if (!business) throw errorFunction.notFoundError("business");

    return business;
}