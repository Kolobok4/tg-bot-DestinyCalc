import {Telegraf, Scenes, session} from "telegraf";
import dotenv from "dotenv";
import inputDataScene from "./src/handlers/scenes/inputData.js";
import {messages} from "./src/config/constants.js";

dotenv.config();

const token = process.env.BOT_TOKEN;
const ids = process.env.USER_IDS;

const bot = new Telegraf(token);
const stage = new Scenes.Stage([inputDataScene]);

const allowedUsers = (ids || "")
    .split(',')
    .map(id => Number(id.trim()))
    .filter(id => !isNaN(id));


// Перевірка доступу
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId || !allowedUsers.includes(userId)) {
        await ctx.reply(messages.access_denied);
        return;
    }
    await next();
});

// Сесія та сцени
bot.use(session());
bot.use(stage.middleware());

// Команди
bot.telegram.setMyCommands([
    { command: "start", description: "Почати роботу" },
    { command: "stop", description: "Скинути всі дані" }
]);

// Обробник /start
bot.command("start", async (ctx) => {
    ctx.session = {}; // Скидання сесії
    await ctx.reply("🚀 Бот запущений! Виберіть параметри для продовження.");
    await ctx.scene.enter("input_data"); // Безпосередньо запускаємо сцену
});

// Обробник /stop
bot.command("stop", async (ctx) => {
    try {
        // Перевіряємо, чи є активна сцена, і виходимо з неї
        if (ctx.scene) {
            await ctx.scene.leave();
        }

        // Скидаємо всі сесійні дані
        ctx.session = {};

        // Підтвердження
        await ctx.reply(messages.reset_data);
    } catch (error) {
        console.error("Помилка при зупинці:", error);
        ctx.reply("❌ Не вдалося скинути дані");
    }
});

// Запуск бота
bot.launch();
console.log("🤖 Бот запущений");
