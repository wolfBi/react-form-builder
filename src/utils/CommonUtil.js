import HttpUtil from "./HttpUtil";
import lodash from 'lodash';

export const deepClone = (obj) => {
    return lodash.cloneDeep(obj)
}
export const guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
export const formatFmno = (fmno) => {
    let value = null;
    if (fmno.length === 3){
        value = "00" + fmno;
    } else if (fmno.length === 4) {
        value = "0" + fmno;
    } else {
        value = fmno;
    }
    return value;
}

export const validateChargeCode  = (token, chargeCode, dispatch) => {
    var url = global['MCKINSEY_API_URL'] + '/v1/charge_codes/' + chargeCode + '/validate';
    return HttpUtil.get(url, {}, dispatch, true, true, {Authorization: `${token.tokenType} ${token.accessToken}`}).then(json => {
        let chargeCodeJson = json.chargeCode;
        if(chargeCodeJson && chargeCodeJson.valid==='true'){
            return true;
        }
        else{
            return false;
        }
    });
}

export const isEmpty = (value) => {
    if (value !== null && value !== undefined ) {
        if(typeof value ==='string' && value.trim() !== ''){
            return false
        }else if(typeof value ==='object' && value.constructor !== Array && !isEmptyObject(value)){
            return false
        }else if(typeof value ==='object' && value.constructor === Array && value.length > 0 ){
            return false
        }else{
            return true
        }
    } else {
        return true
    }
}
export const isEmptyObject = (e) => {
    var t;
    for (t in e)
        return !1;
    return !0
}

