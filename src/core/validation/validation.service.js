import { NAME_REGEX, DATE_FORMAT_REGEX } from '../../bot/config/regex.config.js';
import { errorMessages } from '../../bot/config/messages.js';

export class ValidationService {
    static validateName(name, lang) {
        if (!name || typeof name !== 'string') {
            return { isValid: false, error: errorMessages.empty_name };
        }

        const regex = NAME_REGEX[lang];
        if (!regex.test(name)) {
            return { isValid: false, error: errorMessages.invalid_name_format };
        }

        return { isValid: true };
    }

    static validateDate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return { isValid: false, error: errorMessages.empty_date };
        }

        if (!DATE_FORMAT_REGEX.test(dateString)) {
            return { isValid: false, error: errorMessages.invalid_date_format };
        }

        const [day, month, year] = dateString.split('.').map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getDate() !== day ||
            date.getMonth() !== month - 1 ||
            date.getFullYear() !== year
        ) {
            return { isValid: false, error: errorMessages.invalid_date_value };
        }

        return { isValid: true };
    }

    static validateUserId(userId, allowedUsers) {
        if (!userId || !allowedUsers.includes(userId)) {
            return { isValid: false, error: errorMessages.access_denied };
        }
        return { isValid: true };
    }
} 