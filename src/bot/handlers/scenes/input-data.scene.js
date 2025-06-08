import { Scenes } from "telegraf";
import { messages, errorMessages } from "../../config/messages.js";
import { languageKeyboard } from "../../keyboards/keyboards.js";
import {
    handleLanguageSelection,
    handleNameInput,
    handleDateInput,
    handleConfirmation
} from "../input.handlers.js";

// Створення сцени
const inputDataScene = new Scenes.WizardScene(
    "input_data",
    // Крок 1: Вибір мови
    async (ctx) => {
        try {
            await ctx.reply(messages.choose_language, languageKeyboard);
            return ctx.wizard.next();
        } catch (error) {
            console.error(errorMessages.scene_init_error, error);
            await ctx.reply(messages.error);
            return ctx.scene.leave();
        }
    },
    // Крок 2: Обробка вибору мови
    async (ctx) => {
        try {
            const success = await handleLanguageSelection(ctx);
            if (success) {
                return ctx.wizard.next();
            }
        } catch (error) {
            console.error(errorMessages.language_selection_error, error);
            await ctx.reply(messages.error);
            return ctx.scene.leave();
        }
    },
    // Крок 3: Введення імені
    async (ctx) => {
        try {
            const success = await handleNameInput(ctx);
            if (success) {
                return ctx.wizard.next();
            }
        } catch (error) {
            console.error(errorMessages.name_input_error, error);
            await ctx.reply(messages.error);
            return ctx.scene.leave();
        }
    },
    // Крок 4: Введення дати
    async (ctx) => {
        try {
            const success = await handleDateInput(ctx);
            if (success) {
                return ctx.wizard.next();
            }
        } catch (error) {
            console.error(errorMessages.date_input_error, error);
            await ctx.reply(messages.error);
            return ctx.scene.leave();
        }
    },
    // Крок 5: Обробка підтвердження
    async (ctx) => {
        try {
            const success = await handleConfirmation(ctx);
            if (success) {
                await ctx.scene.leave();
                await ctx.reply(messages.end_calculation);
            }
        } catch (error) {
            console.error(errorMessages.confirmation_error, error);
            await ctx.reply(messages.error);
            await ctx.scene.leave();
        }
    }
);

// Обробник кнопки "Скасувати"
inputDataScene.action("cancel", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.scene.leave();
        await ctx.reply(messages.canceled);
    } catch (error) {
        console.error(errorMessages.cancel_error, error);
        await ctx.reply(messages.error);
    }
});

export default inputDataScene;
