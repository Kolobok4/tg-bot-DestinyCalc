import dotenv from 'dotenv';

dotenv.config();

export const botConfig = {
    token: process.env.BOT_TOKEN,
    allowedUsers: (process.env.USER_IDS || "")
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id)),
    commands: [
        { command: "start", description: "Почати роботу" },
        { command: "stop", description: "Скинути всі дані" }
    ]
}; 