/**
 * Created by Wanggen Zhou on 9/4/2017.
 */
import fetch from 'isomorphic-fetch';
import Promise from 'promise';
import LogUtil from './LogUtil';

export default class HttpUtil {
    static get = (url, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return HttpUtil.send(url, "GET", params, dispatch, showLoading, autoCloseLoading, userHeader);
    }

    static post = (url, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return HttpUtil.send(url, "POST", params, dispatch, showLoading, autoCloseLoading, userHeader);
    }

    static put = (url, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return HttpUtil.send(url, "PUT", params, dispatch, showLoading, autoCloseLoading, userHeader);
    }

    static delete = (url, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return HttpUtil.send(url, "DELETE", params, dispatch, showLoading, autoCloseLoading, userHeader);
    }

    static patch = (url, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return HttpUtil.send(url, "PATCH", params, dispatch, showLoading, autoCloseLoading, userHeader);
    }

    static mergeUrl = (url, ...params) => {
        if (params) {
            let urlParam = "";
            for (let param of params) {
                for(let k of Object.keys(param)) {
                    urlParam += `${k}=${param[k]}&`;
                }
            }
            if (urlParam){
                urlParam = urlParam.substr(0, urlParam.lastIndexOf("&"));
                if (url.indexOf("?") > -1) {
                    url += `&${urlParam}`;
                } else {
                    url += `?${urlParam}`;
                }
            }
        }
        return url;
    }

    static send = (url="", method, params={}, dispatch, showLoading=true, autoCloseLoading=true, userHeader={}) => {
        return new Promise((resolve, reject) => {
            if (dispatch && showLoading) {
                dispatch(startAjax());
            }
            let apiBase = global['SERVER_URL'];
            let fullUrl = apiBase + url;
            if(url.startsWith('/')&&apiBase.endsWith('/')){
                fullUrl = apiBase + url.substr(1,url.length)
            }else if( !url.startsWith('http') && !url.startsWith('HTTP') && !url.startsWith('/') && !apiBase.endsWith('/')){
                fullUrl = apiBase + '/' + url
            }
            if (url.indexOf(global['CURRENT_USER_API']) > -1) {
                fullUrl = url;
            } else if (url.indexOf(global['MCKINSEY_API_URL']) > -1) {
                fullUrl = url;
            }
            let httpReq = null;
            if (method.toUpperCase() === "GET" || method.toUpperCase() === "DELETE") {
                fullUrl = HttpUtil.mergeUrl(fullUrl, params);
                httpReq = new Request(fullUrl, {
                    method: method,
					withCredentials: true,
                    credentials: 'include',
                    headers:userHeader,
                });
            } else {
                httpReq = new Request(fullUrl, {
                    method: method,
					withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        ...userHeader
                    },
                    body: JSON.stringify(params)
                })
            }
            fetch(httpReq).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Network response was not ok.")
                }
            }).then(json => {
                LogUtil.info("HttpUtil.send (" + method + ") JSON: ", json);
                resolve(json);
                if (dispatch && showLoading && autoCloseLoading) {
                    dispatch(endAjax());
                }
            }).catch(error => {
                LogUtil.error("HttpUtil.send (" + method +") Error: ", error);
                reject(error);
                if (dispatch && showLoading && autoCloseLoading) {
                    dispatch(endAjax());
                }
            });
        });
    }
}