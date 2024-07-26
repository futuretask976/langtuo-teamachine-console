export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachine';
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



// http response 处理
export const getRespModel = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data.model) || isBlankObj(resp.data.model)) {
        alert("网络请求出现异常！");
        window.location.href='http://localhost:3000/console/error';
    }
    let model = resp.data.model;
    return model;
};

export const handleErrorResp = (errorResp) => {
    if (isBlankObj(errorResp) || isBlankObj(errorResp.response)) {
        alert("网络请求出现异常！");
        window.location.href='http://localhost:3000/console/error';
    }
    let resp = errorResp.response;
    if (resp.status == 401) {
        alert("认证失败，用户名/密码错误！");
        window.location.href='http://localhost:3000/console/login';
    } else {
        alert("出现未知错误！");
        window.location.href='http://localhost:3000/console/error';
    }
};




