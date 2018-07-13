import lodash from 'lodash';

export default class CommonUtil {

  static deepClone = (obj) => {
    return lodash.cloneDeep(obj)
  }
  static isEmpty = (value) => {
    if (value !== null && value !== undefined ) {
      if(typeof value ==='string' && value.trim() !== ''){
        return false
      }else if(typeof value ==='object' && value.constructor !== Array && !CommonUtil.isEmptyObject(value)){
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
  static isEmptyObject = (e) => {
    var t;
    for (t in e)
      return !1;
    return !0
  }
  static getElementsClass = (elementData) => {
    let baseClasses = 'SortableItem rfb-item';
    if (elementData.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    if (elementData.compWidth) {
      baseClasses += ' col-xs-'+elementData.compWidth;
    }else{
      baseClasses += ' col-xs-12 ';
    }
    return baseClasses;
  }
}