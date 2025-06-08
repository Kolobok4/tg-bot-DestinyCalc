import { Markup } from "telegraf";
import { messages } from "../config/messages.js";

export const languageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(messages.language_ua, "lang_ua")],
    [Markup.button.callback(messages.language_en, "lang_en")]
]);

export const cancelKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(messages.cancel, "cancel")],
]);

export const confirmKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(messages.confirm, "confirm")],
]);
