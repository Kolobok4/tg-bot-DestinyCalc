import { Telegraf, Scenes, session } from "telegraf";
import dotenv from "dotenv";
import express from "express";
import inputDataScene from "./src/handlers/scenes/inputData.js";
import { messages } from "./src/config/constants.js";

dotenv.config();

// Налаштування змінних середовища
const token = process.env.BOT_TOKEN;
const ids = process.env.USER_IDS;
const renderUrl = process.env.RENDER_EXTERNAL_URL;

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
        if (ctx.scene) {
            await ctx.scene.leave();
        }

        ctx.session = {};
        await ctx.reply(messages.reset_data);
    } catch (error) {
        console.error("Помилка при зупинці:", error);
        ctx.reply("❌ Не вдалося скинути дані");
    }
});

// Створення Express сервера
const app = express();
const port = process.env.PORT;

// Визначаємо вебхук
bot.telegram.setWebhook(`${renderUrl}/webhook`);

app.use(express.json());

// Обробка webhook запитів
app.post("/webhook", (req, res) => {
    bot.handleUpdate(req.body, res);
});

// Запуск Express сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
