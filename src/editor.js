var UEDITOR_CONFIG = window.UEDITOR_CONFIG || {};

var baidu = window.baidu || {};

const UE = window.UE = baidu.editor =  {
  plugins: {},
  commands: {},
  instants: {},
  I18N: {},
  _customizeUI: {},
  version: "1.5.0"
};

export default UE

export {
  baidu,
  UEDITOR_CONFIG
}