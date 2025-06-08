import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '../../../logs');

// Створюємо директорію для логів якщо її немає
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const getLogFileName = () => {
    const date = new Date();
    return `bot-${date.toISOString().split('T')[0]}.log`;
};

export const logger = {
    info: (message) => {
        const logMessage = `[INFO] ${new Date().toISOString()}: ${message}\n`;
        console.log(logMessage);
        fs.appendFileSync(path.join(LOG_DIR, getLogFileName()), logMessage);
    },
    
    error: (message, error) => {
        const logMessage = `[ERROR] ${new Date().toISOString()}: ${message}\n${error?.stack || error}\n`;
        console.error(logMessage);
        fs.appendFileSync(path.join(LOG_DIR, getLogFileName()), logMessage);
    },
    
    warn: (message) => {
        const logMessage = `[WARN] ${new Date().toISOString()}: ${message}\n`;
        console.warn(logMessage);
        fs.appendFileSync(path.join(LOG_DIR, getLogFileName()), logMessage);
    }
}; 