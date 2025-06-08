export const NAME_REGEX = {
    ua: /^[а-яґєіїщьюяА-ЯҐЄІЇЩЬЮЯІЄЇҐ ]{2,}$/,
    en: /^[a-zA-Z ]{2,}$/,
};

export const DATE_FORMAT_REGEX = /^\d{2}\.\d{2}\.\d{4}$/; // Формат ДД.ММ.РРРР 