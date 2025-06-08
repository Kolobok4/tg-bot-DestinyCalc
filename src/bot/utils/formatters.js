/**
 * Форматує результати розрахунків
 * @param {Object} data - Дані для форматування
 * @param {string} data.lang - Мова
 * @param {number} data.nameSum - Сума імені
 * @param {Object} data.dateResult - Результати розрахунку дати
 * @param {Object} data.mainFormulas - Основні формули
 * @param {Object} data.additionalFormulas - Додаткові формули
 * @returns {string} - Відформатований текст
 */
const formatResults = (data) => {
    const { lang, nameSum, dateResult, mainFormulas, additionalFormulas } = data;
    const isUA = lang === "ua";

    return `${isUA ? "📊 *Результати розрахунків*" : "📊 *Calculation Results*"}\n\n` +
        `${isUA ? "🌍 *Мова*" : "🌍 *Language*"}: ${isUA ? "Українська" : "English"}\n\n` +
        `${isUA ? "👤 *Сума імені*" : "👤 *Name Sum*"}: ${nameSum}\n\n` +
        `${isUA ? "📅 *Результати розрахунку дати*" : "📅 *Date Calculation Results*"}:\n` +
        `Dt: ${dateResult.Dt}\n` +
        `Mt: ${dateResult.Mt}\n` +
        `Rt: ${dateResult.Rt}\n\n` +
        `${isUA ? "📈 *Основні параметри*" : "📈 *Main Parameters*"}:\n` +
        `OPV: ${mainFormulas.OPV}\n` +
        `TP: ${mainFormulas.TP}\n` +
        `SZ: ${mainFormulas.SZ}\n\n` +
        `${isUA ? "📉 *Додаткові параметри*" : "📉 *Additional Parameters*"}:\n` +
        `OPV2: ${additionalFormulas.OPV2}\n` +
        `OPV3: ${additionalFormulas.OPV3}\n` +
        `OPV4: ${additionalFormulas.OPV4}\n` +
        `OPV5: ${additionalFormulas.OPV5}\n` +
        `OPV6: ${additionalFormulas.OPV6}\n` +
        `TP2: ${additionalFormulas.TP2}\n` +
        `TP3: ${additionalFormulas.TP3}\n` +
        `TP4: ${additionalFormulas.TP4}\n` +
        `TP5: ${additionalFormulas.TP5}\n` +
        `TP6: ${additionalFormulas.TP6}\n` +
        `SZ2: ${additionalFormulas.SZ2}\n` +
        `SZ3: ${additionalFormulas.SZ3}\n` +
        `SZ4: ${additionalFormulas.SZ4}\n` +
        `SZ5: ${additionalFormulas.SZ5}\n` +
        `SZ6: ${additionalFormulas.SZ6}`;
};

/**
 * Форматує повідомлення підтвердження
 * @param {Object} session - Сесія користувача
 * @returns {string} - Відформатований текст
 */
const formatConfirmation = (session) => {
    const isUA = session.lang === "ua";
    return `${isUA ? "📝 *Перевірте введені дані*" : "📝 *Check entered data*"}:\n\n` +
        `${isUA ? "🌍 *Мова*" : "🌍 *Language*"}: ${isUA ? "Українська" : "English"}\n` +
        `${isUA ? "👤 *Ім'я*" : "👤 *Name*"}: ${session.userData.name}\n` +
        `${isUA ? "📅 *Дата народження*" : "📅 *Birth Date*"}: ${session.userData.birthDate}\n\n` +
        `${isUA ? "Підтвердіть введені дані:" : "Confirm entered data:"}`;
};

export { formatResults, formatConfirmation }; 