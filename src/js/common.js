export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachine';


export const isBlankStr = (str) => {
    if (str == undefined || str == null || str == '') {
        return true;
    } else {
        return false;
    }
};

export const genGetUrlByParams = (urlPrefix, urlPath, params) => {
    let url = urlPrefix + urlPath;
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

export const genGetUrlBySegs = (urlPrefix, urlPath, segments) => {
    let url = urlPrefix + urlPath;
    segments.forEach(ele => {
        url = url + "/" + ele;
    })
    return url;
}

export const genPostUrl = (urlPrefix, urlPath) => {
    let url = urlPrefix + urlPath;
    return url;
}

