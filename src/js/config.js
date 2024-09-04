const devBaseURL = 'http://localhost:8080/teamachinebackend';
const prodBaseURL = 'https://47.102.144.19:446/teamachinebackend';

export const BASE_URL = devBaseURL; // process.env.NODE_ENV === 'dev' ? devBaseURL: prodBaseURL;
export const TIMEOUT = 5000;