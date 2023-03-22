export default function balanceCalculator(recharges, payments) {
    var rechargesAmount = recharges.reduce(function (rechargesAmount, recharge) { return (rechargesAmount + recharge.amount); }, 0);
    var paymentsAmount = payments.reduce(function (paymentsAmount, payment) { return (paymentsAmount + payment.amount); }, 0);
    return rechargesAmount - paymentsAmount;
}
