export const CONSOLE_CONTEXT_PATH = '/teamachineconsole'

export const TIMEOUT = 5000;

export const OSS_CONFIG_BUCKET = 'miya-bucket2';
export const OSS_CONFIG_REGION = 'oss-cn-hangzhou';
export const OSS_CONFIG_TEA_FOLDER = 'teamachine/tea';
export const OSS_CONFIG_SERIES_FOLDER = 'teamachine/series';
export const OSS_CONFIG_MENU_FOLDER = 'teamachine/folder';

export const BACKEND_CONTEXT_PATH = '/teamachinebackend'
export const DEV_BACKEND_BASE_URL = 'http://localhost:8080' + BACKEND_CONTEXT_PATH;
export const PROD_BACKEND_BASE_URL = 'https://langtuo.cartisan.top:446' + BACKEND_CONTEXT_PATH;;
export const BACKEND_BASE_URL = DEV_BACKEND_BASE_URL; // process.env.NODE_ENV === 'dev' ? devBaseURL: prodBaseURL;