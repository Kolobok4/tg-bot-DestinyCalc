import { ValidationService } from "../../core/validation/validation.service.js";
import { CalculationService } from "../../core/calculation/calculation.service.js";
import { messages } from "../config/messages.js";
import { cancelKeyboard, confirmKeyboard } from "../keyboards/keyboards.js";
import { formatResults, formatConfirmation } from "../utils/formatters.js";

/**
 * Перевіряє валідність сесії користувача
 * @param {Object} session - Сесія користувача
 * @returns {boolean} - Результат перевірки
 */
const isValidSession = (session) => {
    return session?.userData?.name && session?.userData?.birthDate;
};

/**
 * Обробляє вибір мови
 * @param {Object} ctx - Контекст Telegraf
 * @returns {Promise<boolean>} - Результат обробки
 */
const handleLanguageSelection = async (ctx) => {
    if (!ctx.callbackQuery) return false;

    const lang = ctx.callbackQuery.data;
    if (lang !== "lang_ua" && lang !== "lang_en") {
        await ctx.reply(messages.invalid_language);
        return false;
    }

    ctx.session.lang = lang === "lang_ua" ? "ua" : "en";
    await ctx.answerCbQuery();
    
    await ctx.reply(
        `${ctx.session.lang === "ua" ? messages.language_ua : messages.language_en}\n` +
        messages.enter_name_single
    );
    return true;
};

/**
 * Обробляє введення імені
 * @param {Object} ctx - Контекст Telegraf
 * @returns {Promise<boolean>} - Результат обробки
 */
const handleNameInput = async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
        await ctx.scene.leave();
        await ctx.reply(messages.canceled);
        return false;
    }

    const name = ctx.message.text.trim();
    const validation = ValidationService.validateName(name, ctx.session.lang);

    if (!validation.isValid) {
        await ctx.replyWithMarkdown(validation.error, cancelKeyboard);
        return false;
    }

    ctx.session.userData = ctx.session.userData || {};
    ctx.session.userData.name = name;
    await ctx.reply(messages.enter_birthdate);
    return true;
};

/**
 * Обробляє введення дати
 * @param {Object} ctx - Контекст Telegraf
 * @returns {Promise<boolean>} - Результат обробки
 */
const handleDateInput = async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
        await ctx.scene.leave();
        await ctx.reply(messages.canceled);
        return false;
    }

    const dateInput = ctx.message.text;
    const validation = ValidationService.validateDate(dateInput);

    if (!validation.isValid) {
        await ctx.replyWithMarkdown(
            `${validation.error}\n\n${messages.try_again_or_cancel}`,
            cancelKeyboard
        );
        return false;
    }

    ctx.session.userData.birthDate = dateInput;
    await ctx.replyWithMarkdown(
        formatConfirmation(ctx.session),
        confirmKeyboard
    );
    return true;
};

/**
 * Обробляє підтвердження та розраховує результати
 * @param {Object} ctx - Контекст Telegraf
 * @returns {Promise<boolean>} - Результат обробки
 */
const handleConfirmation = async (ctx) => {
    if (!ctx.callbackQuery) return false;
    await ctx.answerCbQuery();

    if (!isValidSession(ctx.session)) {
        await ctx.reply(messages.error);
        return false;
    }

    if (ctx.callbackQuery.data === "confirm") {
        const nameSum = CalculationService.calculateNameSum(
            ctx.session.userData.name,
            ctx.session.lang
        );
        const dateResult = CalculationService.calculateDateFormula(
            ctx.session.userData.birthDate
        );
        const mainFormulas = CalculationService.calculateMainParams(
            dateResult.Dt,
            dateResult.Mt,
            dateResult.Rt,
            nameSum
        );

        const additionalFormulas = CalculationService.calculateAdditionalParams(
            dateResult.Dt,
            dateResult.Mt,
            dateResult.Rt,
            nameSum,
            mainFormulas.OPV,
            mainFormulas.TP,
            mainFormulas.SZ
        );

        await ctx.replyWithMarkdown(
            formatResults({
                lang: ctx.session.lang,
                nameSum,
                dateResult,
                mainFormulas,
                additionalFormulas
            })
        );
    } else {
        await ctx.replyWithMarkdown(messages.canceled);
    }
    return true;
};

export {
    handleLanguageSelection,
    handleNameInput,
    handleDateInput,
    handleConfirmation
}; 