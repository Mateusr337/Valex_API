var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { faker } from '@faker-js/faker';
import * as cardRepository from './../repositories/cardRepository.js';
import * as employeeService from "../services/employeeService.js";
import * as paymentsRepository from "../repositories/paymentRepository.js";
import * as rechargesRepository from "../repositories/rechargeRepository.js";
import * as errors from "../utils/errorFunctions.js";
import dayjs from 'dayjs';
import * as encryptFunction from '../utils/encryptFunction.js';
import balanceCalculator from '../utils/balanceCalculator.js';
import validatePasswordLength from '../utils/validatePasswordLength.js';
export function createCards(type, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        var employee, creditCardData, cardholderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, employeeService.findEmployeeById(employeeId)];
                case 1:
                    employee = _a.sent();
                    return [4 /*yield*/, validateCardType(type, employeeId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createHandleCardData("mastercard")];
                case 3:
                    creditCardData = _a.sent();
                    return [4 /*yield*/, employeeService.formatNameUserById(employee)];
                case 4:
                    cardholderName = _a.sent();
                    return [4 /*yield*/, cardRepository.insert(__assign(__assign({ employeeId: employeeId, cardholderName: cardholderName }, creditCardData), { password: null, isVirtual: false, originalCardId: null, isBlocked: true, type: type }))];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function createVirtualCard(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var originalCard, creditCardData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCardById(id)];
                case 1:
                    originalCard = _a.sent();
                    return [4 /*yield*/, encryptFunction.compareEncrypted(password, originalCard.password)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createHandleCardData("mastercard")];
                case 3:
                    creditCardData = _a.sent();
                    return [4 /*yield*/, cardRepository.insert(__assign(__assign({ employeeId: originalCard.employeeId, cardholderName: originalCard.cardholderName }, creditCardData), { password: originalCard.password, isVirtual: true, originalCardId: originalCard.id, isBlocked: false, type: originalCard.type }))];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function activateCards(password, cardId, CVC) {
    return __awaiter(this, void 0, void 0, function () {
        var card, passwordEncrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCardById(cardId)];
                case 1:
                    card = _a.sent();
                    if (card.isVirtual)
                        throw errors.unauthorizedError("card");
                    validatePasswordLength(password);
                    return [4 /*yield*/, validateIsCardActive(card, true)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, encryptFunction.compareEncrypted(CVC, card.securityCode)];
                case 3:
                    _a.sent();
                    passwordEncrypted = encryptFunction.encryptData(password);
                    return [4 /*yield*/, cardRepository.update(cardId, {
                            password: passwordEncrypted,
                            isBlocked: false
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function getCardOperationsById(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var card, transactions, recharges, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCardById(cardId)];
                case 1:
                    card = _a.sent();
                    return [4 /*yield*/, validateIsCardActive(card, false)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, paymentsRepository.findByCardId(cardId)];
                case 3:
                    transactions = _a.sent();
                    return [4 /*yield*/, rechargesRepository.findByCardId(cardId)];
                case 4:
                    recharges = _a.sent();
                    balance = balanceCalculator(recharges, transactions);
                    return [2 /*return*/, {
                            balance: balance,
                            transactions: transactions,
                            recharges: recharges
                        }];
            }
        });
    });
}
export function blockUnlockCard(id, password, block) {
    return __awaiter(this, void 0, void 0, function () {
        var card, blockValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCardById(id)];
                case 1:
                    card = _a.sent();
                    return [4 /*yield*/, validateIsCardActive(card, false)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, encryptFunction.compareEncrypted(password, card.password)];
                case 3:
                    _a.sent();
                    blockValue = validateBlock(block, card);
                    return [4 /*yield*/, cardRepository.update(card.id, { isBlocked: blockValue })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function validateBlock(block, card) {
    var blockOptions = ["block", "unlock"];
    if (!blockOptions.includes(block))
        throw errors.badRequestError("block type must be 'block' or 'unlock'");
    if (card.isBlocked && block === "block")
        throw errors.unauthorizedError("card is blocked");
    if (!card.isBlocked && block === "unlock")
        throw errors.unauthorizedError("card is unlocked");
    var blockValue = block === "block" ? true : false;
    return blockValue;
}
export function findCardById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var cardFound;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    cardFound = _a.sent();
                    if (!cardFound)
                        throw errors.notFoundError('card');
                    return [2 /*return*/, cardFound];
            }
        });
    });
}
function createHandleCardData(cardFlag) {
    return __awaiter(this, void 0, void 0, function () {
        var existCreditCard, creditCard, ValidityYear, validityMonth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ValidityYear = parseInt(dayjs().format("YY")) + 5;
                    validityMonth = dayjs().format("MM");
                    _a.label = 1;
                case 1:
                    creditCard = {
                        number: faker.finance.creditCardNumber(cardFlag.toLowerCase()),
                        securityCode: faker.finance.creditCardCVV().toString(),
                        expirationDate: "".concat(validityMonth, "/").concat(ValidityYear)
                    };
                    return [4 /*yield*/, cardRepository.findByCardNumber(creditCard.cardNumber)];
                case 2:
                    existCreditCard = _a.sent();
                    _a.label = 3;
                case 3:
                    if (existCreditCard) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    creditCard.securityCode = encryptFunction.encryptData(creditCard.securityCode);
                    return [2 /*return*/, creditCard];
            }
        });
    });
}
export function validateIsCardActive(card, isActivation) {
    return __awaiter(this, void 0, void 0, function () {
        var dateToday;
        return __generator(this, function (_a) {
            dateToday = "".concat(dayjs().format('MM'), "/").concat(dayjs().format('YY'));
            if (card.expirationDate < dateToday)
                throw errors.unauthorizedError('creditCard');
            if (card.password && isActivation)
                throw errors.unauthorizedError('creditCardId');
            return [2 /*return*/];
        });
    });
}
function validateCardType(type, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        var arrayCardsTypes, hasCardThisType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    arrayCardsTypes = [
                        'groceries',
                        'restaurant',
                        'transport',
                        'education',
                        'health',
                    ];
                    if (!arrayCardsTypes.includes(type)) {
                        throw errors.badRequestError('cardType');
                    }
                    return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(type, employeeId)];
                case 1:
                    hasCardThisType = _a.sent();
                    if (hasCardThisType)
                        throw errors.badRequestError('Type card already exist to this employee');
                    return [2 /*return*/];
            }
        });
    });
}
export function findByCardDetails(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var number, cardholderName, expirationDate, foundCard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    number = cardData.number, cardholderName = cardData.cardholderName, expirationDate = cardData.expirationDate;
                    return [4 /*yield*/, cardRepository.findByCardDetails(number, cardholderName, expirationDate)];
                case 1:
                    foundCard = _a.sent();
                    if (!foundCard)
                        throw errors.notFoundError("card");
                    return [2 /*return*/, foundCard];
            }
        });
    });
}
export function deleteCards(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCardById(id)];
                case 1:
                    card = _a.sent();
                    if (!card.isVirtual)
                        throw errors.unauthorizedError("card");
                    encryptFunction.compareEncrypted(password, card.password);
                    return [4 /*yield*/, cardRepository.remove(id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
