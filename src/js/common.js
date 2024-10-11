// 通用方法
export const getYesterday = () => {
    // 获取当前日期
    let today = new Date();
 
    // 获取昨天日期
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
}

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

export const isValidVersion = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^\d+(\.\d+){1,2}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};


export const arraysEqual = (arr1, arr2) => {
    if (arr1 == undefined || arr2 == undefined) {
        return false;
    }

    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((obj, index) => {
      const otherObj = arr2[index];
      return Object.keys(obj).length === Object.keys(otherObj).length &&
             Object.keys(obj).every(key => obj[key] === otherObj[key]);
    });
}

export const shallowEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }
    if (!obj1 || !obj2) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}

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

export const getLang = () => {
    let lang = localStorage.getItem('lang');
    if (isBlankStr(lang)) {
        return 'zh_CN';
    } else {
        return lang;
    }
};

export const getLoginName = () => {
    let loginName = localStorage.getItem('loginName');
    if (isBlankStr(loginName)) {
        return undefined;
    } else {
        return loginName;
    }
};

export const getJwtToken = () => {
    let jwtToken = localStorage.getItem('jwtToken');
    if (isBlankStr(jwtToken)) {
        return undefined;
    } else {
        return jwtToken;
    }
};

export const getTenantCode = () => {
    let tenantCode = localStorage.getItem('tenantCode');
    if (isBlankStr(tenantCode)) {
        return undefined;
    } else {
        return tenantCode;
    }
};

export const putLang = (lang) => {
    localStorage.setItem('lang', lang);
};

export const putLoginName = (loginName) => {
    localStorage.setItem('loginName', loginName);
};

export const putJwtToken = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
};

export const putTenantCode = (tenantCode) => {
    localStorage.setItem('tenantCode', tenantCode);
};




