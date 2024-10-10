import { useContext } from "react";

import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

import { FamePageContext } from '../js/context';

const languages = {
    en,
    zh,
};

export const useLang = (key) => {
    const { lang } = useContext(FamePageContext);
    return languages[lang][key];
}