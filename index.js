import { Telegraf, Scenes, session } from "telegraf";
import { botConfig } from "./src/bot/config/bot.config.js";
import { ValidationService } from "./src/core/validation/validation.service.js";
import inputDataScene from "./src/bot/handlers/scenes/input-data.scene.js";
import { messages, errorMessages } from "./src/bot/config/messages.js";

const bot = new Telegraf(botConfig.token);
const stage = new Scenes.Stage([inputDataScene]);

// Перевірка доступу
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    const validation = ValidationService.validateUserId(userId, botConfig.allowedUsers);
    
    if (!validation.isValid) {
        await ctx.reply(messages.access_denied);
        return;
    }
    await next();
});

// Сесія та сцени
bot.use(session());
bot.use(stage.middleware());

// Команди
bot.telegram.setMyCommands(botConfig.commands);

// Обробник /start
bot.command("start", async (ctx) => {
    ctx.session = {}; // Скидання сесії
    await ctx.reply("🚀 Бот запущений! Виберіть параметри для продовження.");
    await ctx.scene.enter("input_data");
});

// Обробник /stop
bot.command("stop", async (ctx) => {
    try {
        if (ctx.scene) {
            await ctx.scene.leave();
        }
        ctx.session = {};
        await ctx.reply(messages.reset_data);
    } catch (error) {
        console.error(errorMessages.bot_stop_error, error);
        ctx.reply("❌ Не вдалося скинути дані");
    }
});

// Запуск бота
bot.launch()
    .then(() => {
        console.log('Бот успішно запущено!');
    })
    .catch((error) => {
        console.error(errorMessages.bot_start_error, error);
    });

// Обробка завершення роботи
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
