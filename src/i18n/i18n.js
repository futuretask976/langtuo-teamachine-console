import { getLang, isBlankStr } from '../js/common.js';

import zh_CN from '../i18n/zh_CN.json';
import en_US from '../i18n/en_US.json';

const languages = {
    zh_CN,
    en_US,
};

export const applyLang = (key) => {
    let lang = getLang();
    if (isBlankStr(lang)) {
        lang = 'zh_CN';
    }
    return languages[lang][key];
}
