import { useNavigate } from "react-router-dom";

export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachinebackend';
// export const TEAMACHINE_HOST_URL = 'https://47.102.144.19:446/teamachinebackend';
export const OSS_CONFIG_BUCKET = 'miya-bucket2';
export const OSS_CONFIG_REGION = 'oss-cn-hangzhou';
export const OSS_CONFIG_TEA_FOLDER = 'teamachine/tea';
export const OSS_CONFIG_SERIES_FOLDER = 'teamachine/series';
export const OSS_CONFIG_MENU_FOLDER = 'teamachine/folder';

// 通用方法
export const dateToYMDHMS = (date) => {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
   
    date = new Date(date);
    return (
        date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds())
    );
}

export const genGetUrl = (path) => {
    let url = TEAMACHINE_HOST_URL + path;
    return url;
}

export const genGetUrlByParams = (path, params) => {
    let url = TEAMACHINE_HOST_URL + path;
    let paramStr = '';
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            paramStr = paramStr + "&" + key + "=" + params[key];
        }
    }
    if (isBlankStr(paramStr)) {
        return url;
    } else {
        return url + "?" + paramStr.slice(1);
    }
}

export const genGetUrlBySegs = (path, segments) => {
    let url = TEAMACHINE_HOST_URL + path;
    segments.forEach(ele => {
        url = url.replace('{segment}', ele);
    })
    return url;
}

export const genPostUrl = (path) => {
    let url = TEAMACHINE_HOST_URL + path;
    return url;
}

export const isArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return false;
    } else {
        return true;
    }
};

export const isEmptyArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return true;
    } else {
        if (arr.length == 0) {
            return true;
        } else {
            return false;
        }
    }
};

export const isBlankArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return true;
    } else if (arr.length == 0) {
        return true;
    } else {
        return false;
    }
};

export const isBlankObj = (obj) => {
    if (obj == undefined || obj == null) {
        return true;
    } else {
        return false;
    }
};

export const isBlankStr = (str) => {
    if (str == undefined || str == null || str == '') {
        return true;
    } else {
        return false;
    }
};

export const isNumber = (value) => {
    return /^-?\d+(\.\d+)?$/.test(value);
};

export const isValidCode = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_]{0,50}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

export const isValidName = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_\u4e00-\u9fa5]{0,50}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

export const isValidComment = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uFF01]{0,200}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

// http response 处理
export const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// 清除本地存储的认证信息，如token等
export const deleteJwtToken = () => {
    localStorage.removeItem('jwtToken');
    deleteCookie('JSESSIONID');
};

export const deleteLoginName = () => {
    localStorage.removeItem('loginName');
};


export const getJwtToken = () => {
    let jwtToken = localStorage.getItem('jwtToken');
    if (isBlankStr(jwtToken)) {
        return null;
    } else {
        return jwtToken;
    }
};

export const getLoginName = () => {
    let loginName = localStorage.getItem('loginName');
    if (isBlankStr(loginName)) {
        return null;
    } else {
        return loginName;
    }
};

export const getTenantCode = () => {
    let tenantCode = localStorage.getItem('tenantCode');
    if (isBlankStr(tenantCode)) {
        return null;
    } else {
        return tenantCode;
    }
};

export const putJwtToken = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
};

export const putLoginName = (loginName) => {
    localStorage.setItem('loginName', loginName);
};

export const putTenantCode = (tenantCode) => {
    localStorage.setItem('tenantCode', tenantCode);
};




