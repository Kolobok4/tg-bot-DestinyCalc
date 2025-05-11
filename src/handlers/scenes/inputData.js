import { Scenes} from "telegraf";
import {calculateAdditionalParams, calculateDateFormula, calculateMainParams, calculateNameSum, isValidDate} from "../../utils/utils.js";
import {DATE_FORMAT_REGEX, messages, NAME_REGEX} from "../../config/constants.js";
import {cancelKeyboard, confirmKeyboard, languageKeyboard} from "../../keyboards/keyboards.js";

const inputDataScene = new Scenes.WizardScene(
    "input_data",

    // Крок 1: Вибір мови
    async (ctx) => {
        await ctx.reply("🌐 Оберіть мову:", languageKeyboard);
        return ctx.wizard.next();
    },

    // Крок 2: Обробка вибору мови
    async (ctx) => {
        if (!ctx.callbackQuery) return;

        const lang = ctx.callbackQuery.data;
        if (lang !== "lang_ua" && lang !== "lang_en") {
            return;
        }

        ctx.session.lang = lang === "lang_ua" ? "ua" : "en";

        await ctx.answerCbQuery();
        await ctx.reply(
            `${ctx.session.lang === "ua" ? messages.language_ua : messages.language_en}\n` +
            messages.enter_name_single
        );
        return ctx.wizard.next();
    },

    // Крок 3: Введення імені
    async (ctx) => {
        if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
            await ctx.scene.leave();
            return ctx.reply(messages.canceled);
        }

        const name = ctx.message.text.trim();

        const regex = NAME_REGEX[ctx.session.lang]; // Вибір регулярного виразу на основі мови

        if (!regex.test(name)) {
            await ctx.replyWithMarkdown(messages.invalid_name, cancelKeyboard);
            return;
        }

        ctx.session.userData = ctx.session.userData || {};
        ctx.session.userData.name = name;
        await ctx.reply(messages.enter_birthdate);
        return ctx.wizard.next();
    },


    // Крок 4: Введення дати
    async (ctx) => {
        if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
            await ctx.scene.leave();
            return ctx.reply(messages.canceled);
        }

        const dateInput = ctx.message.text;

        // Перевірка формату
        if (!DATE_FORMAT_REGEX.test(dateInput)) {
            await ctx.replyWithMarkdown(
                `${messages.invalid_format}\n\n${messages.try_again_or_cancel}`,
                cancelKeyboard
            );
            return;
        }

        // Перевірка коректності дати
        if (!isValidDate(dateInput)) {
            await ctx.replyWithMarkdown(
                `${messages.invalid_date}\n\n${messages.try_again_or_cancel}`,
                cancelKeyboard
            );
            return;
        }

        ctx.session.userData.birthDate = dateInput;

        // Підтвердження даних
        await ctx.replyWithMarkdown(
            `✅ *Перевірте дані:*\n` +
            `🌍 Мова: ${ctx.session.lang === "ua" ? messages.language_ua : messages.language_en}\n` +
            `👤 Ім'я: ${ctx.session.userData.name}\n` +
            `📅 Дата: ${ctx.session.userData.birthDate}`,
            confirmKeyboard,
            cancelKeyboard,
        );
        return ctx.wizard.next();
    },

    // Крок 5: Обробка підтвердження
    async (ctx) => {
        if (!ctx.callbackQuery) return;
        await ctx.answerCbQuery();

        if (ctx.callbackQuery.data === "confirm") {
            const nameSum = calculateNameSum(ctx.session.userData.name, ctx.session.lang);
            const dateResult = calculateDateFormula(ctx.session.userData.birthDate);
            const mainFormulas = calculateMainParams(
                dateResult.Dt,
                dateResult.Mt,
                dateResult.Rt,
                nameSum
            );

            const additionalFormulas = calculateAdditionalParams(
                dateResult.Dt,
                dateResult.Mt,
                dateResult.Rt,
                nameSum,
                mainFormulas.OPV,
                mainFormulas.TP,
                mainFormulas.SZ,
                mainFormulas.ZK,
                mainFormulas.Vocation,
                mainFormulas.ZV
            );

            await ctx.replyWithMarkdown(
                `🔮 *Результати розрахунків:*\n\n` +
                `🌍 **Мова:** ${ctx.session.lang === "ua" ? messages.language_ua : messages.language_en}\n` +
                `📛 **Число імені:** ${nameSum}\n\n` +
                `📅 **Формула дати:**\n\n` +
                `- Дт: ${dateResult.Dt}\n` +
                `- Мт: ${dateResult.Mt}\n` +
                `- Рт: ${dateResult.Rt}\n\n` +
                `🧮 ** Основні параметри:**\n\n` +
                `- ОПВ: ${mainFormulas.OPV}\n` +
                `- ТП: ${mainFormulas.TP}\n` +
                `- СЗ: ${mainFormulas.SZ}\n` +
                `- ЗК: ${mainFormulas.ZK}\n` +
                `- Покликання: ${mainFormulas.Vocation}\n` +
                `- ЗВ: ${mainFormulas.ZV}\n` +
                `- ЗЗ: ${mainFormulas.ZZ}\n\n` +
                `📊 ** Додаткові параметри**\n\n` +
                `- ТПЛ: ${additionalFormulas.TPL}\n` +
                `- ЕХ: ${additionalFormulas.EX}\n` +
                `- КУ1: ${additionalFormulas.KU1}\n` +
                `- КУ2: ${additionalFormulas.KU2}\n` +
                `- КУ3: ${additionalFormulas.KU3}\n` +
                `- КУ4: ${additionalFormulas.KU4}\n` +
                `\n` +
                `- ТП2: ${additionalFormulas.TP2}\n` +
                `- ТП3: ${additionalFormulas.TP3}\n` +
                `- ТП4: ${additionalFormulas.TP4}\n` +
                `- ТП5: ${additionalFormulas.TP5}\n` +
                `\n` +
                `- ОПВ2: ${additionalFormulas.OPV2}\n` +
                `- ОПВ3: ${additionalFormulas.OPV3}\n` +
                `- ОПВ4: ${additionalFormulas.OPV4}\n` +
                `- ОПВ5: ${additionalFormulas.OPV5}\n` +
                `- ОПВ6: ${additionalFormulas.OPV6}`,
            );
        } else {
            await ctx.replyWithMarkdown(cancelKeyboard);
        }
        await ctx.scene.leave();
        await ctx.reply(
            messages.end_calculation,
        );
    }
);

// Обробник кнопки "Скасувати"
inputDataScene.action("cancel", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
    await ctx.reply(
        messages.canceled,
    );
});

export default inputDataScene;
