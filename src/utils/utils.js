export const isValidDate = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
    );
};

// Додаємо мапу значень літер
export const letterValues = {
    ua: {
        'а': 1, 'б': 2, 'в': 3, 'г': 4, 'ґ': 5,
        'д': 6, 'е': 7, 'є': 8, 'ж': 9, 'з': 1,
        'и': 2, 'і': 3, 'ї': 4, 'й': 5, 'к': 6,
        'л': 7, 'м': 8, 'н': 9, 'о': 1, 'п': 2,
        'р': 3, 'с': 4, 'т': 5, 'у': 6, 'ф': 7,
        'х': 8, 'ц': 9, 'ч': 1, 'ш': 2, 'щ': 3,
        'ь': 4, 'ю': 5, 'я': 6
    },
    en: {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5,
        'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 1,
        'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6,
        'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2,
        'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7,
        'z': 8
    }
};

// Функція для корекції значень (ітеративна)
export const adjustValue = (value) => {
    let absValue = Math.abs(value);
    if (absValue > 22) { // Лише якщо більше, але не дорівнює 22
        while (absValue > 22) {
            absValue = absValue - 22; // Віднімаємо 22 від поточного результату
        }
    }
    return absValue === 0 ? 22 : absValue; // Якщо 0 → 22
};

// Функція для розрахунку суми літер імені
export const calculateNameSum = (name, lang) => {
    const map = letterValues[lang];

    return name
        .toLowerCase()
        .split('')
        .filter(ch => map[ch])
        .map(ch => map[ch])
        .reduce((sum, val) => sum + val, 0);
}

export const calculateDateFormula = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);

    // Дт: якщо день > 22 → day - 22, інакше day
    const Dt = day > 22 ? day - 22 : day;

    // Мт: місяць без змін (без нулів)
    const Mt = adjustValue(month);

    // Рт: сума всіх цифр року, якщо сума > 22 → віднімаємо 22 лише ОДИН раз
    const yearDigits = [...String(year)].map(Number);
    let Rt = yearDigits.reduce((sum, digit) => sum + digit, 0);
    if (Rt > 22) {
        Rt -= 22;
    }

    return { Dt, Mt, Rt };
};

// Основні параметри
export const calculateMainParams = (Dt, Mt, Rt, nameSum) => {
    // ОПВ = |Дт - Мт|, якщо 0 → 22
    const OPV = adjustValue(Dt - Mt);

    // ТП = |Дт + Мт|, якщо 0 → 22
    const TP = adjustValue(Dt + Mt);

    // СЗ = |Дт + Мт + Рт|, якщо 0 → 22
    const SZ = adjustValue(Dt + Mt + Rt);

    // ЗК = |2*Мт + Дт + Рт|, якщо 0 → 22
    const ZK = adjustValue(2 * Mt + Dt + Rt);

    // Покликання = |Мт*9 + nameSum + Рт|
    const Vocation = adjustValue(Mt * 9 + nameSum + Rt);

    // ЗВ = |СЗ + Покликання|
    const ZV = adjustValue(SZ + Vocation);

    // ЗЗ = |СЗ - Покликання|
    const ZZ = adjustValue(SZ - Vocation);

    return { OPV, TP, SZ, ZK, Vocation, ZV, ZZ };
};

// Додаткові параметри
export const calculateAdditionalParams = (Dt, Mt, Rt, nameSum, OPV, TP, SZ) => {
    // ТПЛ = Мт + Рт, якщо 0 → 22
    const TPL = adjustValue(Mt + Rt);

    // ЕХ = |Мт - Рт|, якщо 0 → 22
    const EX = adjustValue(Mt - Rt);

    // КУ1 = |ОПВ - SZ
    const KU1 = adjustValue(OPV - SZ);

    // КУ2 = Дт + ОПВ, якщо 0 → 22
    const KU2 = adjustValue(Dt + OPV);

    // КУ3 = |Дт - Рт|, якщо 0 → 22
    const KU3 = adjustValue(Dt - Rt);

    // КУ4 = Рт + SZ
    const KU4 = adjustValue(Rt + SZ);

    // ТП2 = Дт + Рт, якщо 0 → 22
    const TP2 = adjustValue(Dt + Rt);

    // ТП3 = ТП + ТП2
    const TP3 = adjustValue(TP + TP2);

    // ТП4 = Мт + Рт, якщо 0 → 22
    const TP4 = adjustValue(Mt + Rt);

    const TP5 = adjustValue(
        TP +
        TP2 +
        TP3 +
        TP4
    );

    // ОПВ2-ОПВ6
    const OPV2 = adjustValue(Dt - Rt);
    const OPV3 = adjustValue(OPV - OPV2);
    const OPV4 = adjustValue(Mt - Rt);
    const OPV5 = adjustValue(OPV + OPV2 + OPV3 + OPV4);
    const OPV6 = (Dt >= 14 && Dt <= 22) ? adjustValue(OPV5 + Dt) : 0;

    return {
        TPL, EX, KU1, KU2, KU3, KU4,
        TP2, TP3, TP4, TP5,
        OPV2, OPV3, OPV4, OPV5, OPV6
    };
};
