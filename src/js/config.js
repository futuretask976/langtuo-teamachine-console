const devBaseURL = 'http://localhost:8080/teamachinebackend';
const prodBaseURL = 'https://47.102.144.19:446/teamachinebackend';

export const BASE_URL = devBaseURL; // process.env.NODE_ENV === 'dev' ? devBaseURL: prodBaseURL;
export const TIMEOUT = 5000;

export const OSS_CONFIG_BUCKET = 'miya-bucket2';
export const OSS_CONFIG_REGION = 'oss-cn-hangzhou';
export const OSS_CONFIG_TEA_FOLDER = 'teamachine/tea';
export const OSS_CONFIG_SERIES_FOLDER = 'teamachine/series';
export const OSS_CONFIG_MENU_FOLDER = 'teamachine/folder';