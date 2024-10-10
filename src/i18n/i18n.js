import { useContext } from "react";

import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

import { LangContext } from '../js/context';

const languages = {
    en,
    zh,
};

export const useLang = (key) => {
    const { lang } = useContext(LangContext);
    console.log('$$$$$ i18n|useLang|entering|' + lang);
    return languages[lang][key];
}