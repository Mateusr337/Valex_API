import * as errors from "../utils/errorFunctions.js";
import * as employeesRepository from "../repositories/employeeRepository.js";


export default async function validateId(id: number) {
    if (id < 0 || typeof (id) !== "number") {
        throw errors.badRequestError('id');
    }
    const employee = await employeesRepository.findById(id);
    if (!employee) throw errors.notFoundError("employee");
}