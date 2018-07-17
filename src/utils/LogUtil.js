/**
 * Created by zhou on 2017/5/16.
 */

export default class LogUtil {

    static logLevelInfo = 'info';
    static logLevelError = 'error';

    static info = (title, obj) => {
        if (window.__DEV__) {
            if (title) {
                console.log(`%c${title}`, "color: green");
            }
            if (obj) {
                console.log(obj);
            }
        }
    }

    static error = (title, obj) => {
        if (window.__DEV__) {
            if (title) {
                console.log(`%c${title}`, "color: red");
            }
            if (obj) {
                console.log(obj);
            }
        }
    }

    static log = (title, obj, info=LogUtil.logLevelInfo) => {
        if (info === LogUtil.logLevelInfo) {
            LogUtil.info(title, obj);
        } else if (info === LogUtil.logLevelError) {
            LogUtil.error(title, obj);
        }
    }
}