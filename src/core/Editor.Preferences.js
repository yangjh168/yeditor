import LoadConfig from './loadconfig'
import LocalStorage from './localstorage'

var ROOTKEY = "ueditor_preference";

class EditorPreferences extends LoadConfig {
  setPreferences = function(key, value) {
    var obj = {};
    if (utils.isString(key)) {
      obj[key] = value;
    } else {
      obj = key;
    }
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      utils.extend(data, obj);
    } else {
      data = obj;
    }
    data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));
  };
  
  getPreferences = function(key) {
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      return key ? data[key] : data;
    }
    return null;
  };
  
  removePreferences = function(key) {
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      data[key] = undefined;
      delete data[key];
    }
    data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));
  };
}