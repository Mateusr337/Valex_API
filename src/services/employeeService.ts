import * as employeesRepository from "../repositories/employeeRepository.js";
import * as errors from "../utils/errorFunctions.js";

export async function formatNameUserById(id: number) {

    const { fullName } = await employeesRepository.findById(id);
    const arrayNames = fullName.split(' ').filter(name => name.length >= 3);

    const cardName = arrayNames.map((name, i) => {
        if (i === 0 || i === arrayNames.length - 1) return name;
        return name[0];
    });

    const formattedName = cardName.join(' ').toLocaleUpperCase();
    return formattedName;
}

export async function validateEmployeeById(id: number) {
    if (id < 0 || typeof (id) !== "number") {
        throw errors.badRequestError('id');
    }
    const employee = await employeesRepository.findById(id);
    if (!employee) throw errors.notFoundError("employee");
}