import { letterValues } from './letter.utils.js';

// Константи для розрахунків
const CONSTANTS = {
    MAX_VALUE: 22,
    MIN_DAY_FOR_OPV6: 14,
    MAX_DAY_FOR_OPV6: 22,
    DEFAULT_VALUE: 22
};

/**
 * Сервіс для виконання різних розрахунків
 */
export class CalculationService {
    /**
     * Коригує значення до діапазону 1-22
     * @param {number} value - Вхідне значення
     * @returns {number} Скориговане значення
     */
    static adjustValue(value) {
        let absValue = Math.abs(value);
        
        while (absValue > CONSTANTS.MAX_VALUE) {
            absValue -= CONSTANTS.MAX_VALUE;
        }
        
        return absValue === 0 ? CONSTANTS.DEFAULT_VALUE : absValue;
    }

    /**
     * Розраховує суму значень літер імені
     * @param {string} name - Ім'я для розрахунку
     * @param {string} lang - Мова імені ('ua' або 'en')
     * @returns {number} Сума значень літер
     */
    static calculateNameSum(name, lang) {
        const map = letterValues[lang];
        return name
            .toLowerCase()
            .split('')
            .filter(char => map[char])
            .reduce((sum, char) => sum + map[char], 0);
    }

    /**
     * Розраховує формулу дати
     * @param {string} dateString - Дата у форматі ДД.ММ.РРРР
     * @returns {Object} Об'єкт з параметрами Dt, Mt, Rt
     */
    static calculateDateFormula(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        
        const Dt = day > CONSTANTS.MAX_VALUE ? day - CONSTANTS.MAX_VALUE : day;
        const Mt = this.adjustValue(month);
        const Rt = this.adjustValue(
            [...String(year)].reduce((sum, digit) => sum + Number(digit), 0)
        );

        return { Dt, Mt, Rt };
    }

    /**
     * Розраховує основні параметри
     * @param {number} Dt - День
     * @param {number} Mt - Місяць
     * @param {number} Rt - Рік
     * @param {number} nameSum - Сума імені
     * @returns {Object} Об'єкт з основними параметрами
     */
    static calculateMainParams(Dt, Mt, Rt, nameSum) {
        return {
            OPV: this.adjustValue(Dt - Mt),
            TP: this.adjustValue(Dt + Mt),
            SZ: this.adjustValue(Dt + Mt + Rt),
            ZK: this.adjustValue(2 * Mt + Dt + Rt),
            Vocation: this.adjustValue(Mt * 9 + nameSum + Rt),
            ZV: this.adjustValue(this.adjustValue(Dt + Mt + Rt) + this.adjustValue(Mt * 9 + nameSum + Rt)),
            ZZ: this.adjustValue(this.adjustValue(Dt + Mt + Rt) - this.adjustValue(Mt * 9 + nameSum + Rt))
        };
    }

    /**
     * Розраховує додаткові параметри
     * @param {number} Dt - День
     * @param {number} Mt - Місяць
     * @param {number} Rt - Рік
     * @param {number} nameSum - Сума імені
     * @param {number} OPV - Основний параметр
     * @param {number} TP - Точка переходу
     * @param {number} SZ - Сума значень
     * @returns {Object} Об'єкт з додатковими параметрами
     */
    static calculateAdditionalParams(Dt, Mt, Rt, nameSum, OPV, TP, SZ) {
        // Розрахунок першої групи параметрів
        const TPL = this.adjustValue(Mt + Rt);
        const EX = this.adjustValue(Mt - Rt);
        const KU1 = this.adjustValue(OPV - SZ);
        const KU2 = this.adjustValue(Dt + OPV);
        const KU3 = this.adjustValue(Dt - Rt);
        const KU4 = this.adjustValue(Rt + SZ);

        // Розрахунок другої групи параметрів
        const TP2 = this.adjustValue(Dt + Rt);
        const TP3 = this.adjustValue(TP + TP2);
        const TP4 = this.adjustValue(Mt + Rt);
        const TP5 = this.adjustValue(TP + TP2 + TP3 + TP4);

        // Розрахунок третьої групи параметрів
        const OPV2 = this.adjustValue(Dt - Rt);
        const OPV3 = this.adjustValue(OPV - OPV2);
        const OPV4 = this.adjustValue(Mt - Rt);
        const OPV5 = this.adjustValue(OPV + OPV2 + OPV3 + OPV4);
        const OPV6 = this.calculateOPV6(Dt, OPV5);

        return {
            TPL, EX, KU1, KU2, KU3, KU4,
            TP2, TP3, TP4, TP5,
            OPV2, OPV3, OPV4, OPV5, OPV6
        };
    }

    /**
     * Розраховує OPV6 з урахуванням умов
     * @param {number} Dt - День
     * @param {number} OPV5 - Параметр OPV5
     * @returns {number} Значення OPV6
     */
    static calculateOPV6(Dt, OPV5) {
        return (Dt >= CONSTANTS.MIN_DAY_FOR_OPV6 && Dt <= CONSTANTS.MAX_DAY_FOR_OPV6)
            ? this.adjustValue(OPV5 + Dt)
            : 0;
    }
} 