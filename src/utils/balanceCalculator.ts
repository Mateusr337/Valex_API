import * as rechargesRepository from "../repositories/rechargeRepository.js";
import * as paymentsRepository from "../repositories/paymentRepository.js";


export default function balanceCalculator(
    recharges: rechargesRepository.Recharge[],
    payments: paymentsRepository.Payment[],
): number {
    const rechargesAmount: number = recharges.reduce((rechargesAmount, recharge) => (
        rechargesAmount + recharge.amount
    ), 0);

    const paymentsAmount: number = payments.reduce((paymentsAmount, payment) => (
        paymentsAmount + payment.amount
    ), 0);

    return rechargesAmount - paymentsAmount;
}