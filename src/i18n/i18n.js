import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

const languages = {
    en,
    zh,
};

export const getLang = (lang, key) => {
    return languages[lang][key];
}
