import Reflux from 'reflux';
import ElementActions from '../actions/ElementActions';
import HttpUtil from '../utils/HttpUtil';

var _data = [];
var _saveUrl;

var ElementStore = Reflux.createStore({
  init: function () {
    this.listenTo(ElementActions.createElement, this._create);
    this.listenTo(ElementActions.deleteElement, this._delete);
    this.listenTo(ElementActions.save, this.save);
    this.listenTo(ElementActions.saveData, this._updateOrder)
  },

  load: function (urlOrData, saveUrl) {

    var self = this;
    _saveUrl = saveUrl;

    if (typeof urlOrData == 'string' || urlOrData instanceof String) {
      HttpUtil.get(urlOrData).then((data)=>{
        _data = JSON.parse(data);
        self.trigger(_data);
      })
    } else {
      _data = urlOrData;
      self.trigger(_data);
    }
  },

  _create: function (element) {
    _data.push(element);
    this.trigger(_data);
    this.save();
  },

  _delete: function (element) {
    var index = _data.indexOf(element);
    _data.splice(index, 1);
    this.trigger(_data);
    this.save();
  },

  _updateOrder: function (elements) {
    _data = elements;
    this.trigger(_data);
    this.save();
  },

  save: function () {
    if (_saveUrl) {
      HttpUtil.post(_saveUrl,{
        task_data: JSON.stringify(_data)
      }).then((data)=>{
        console.log('Saved... ', arguments);
      })
    }
  }

});

module.exports = ElementStore;