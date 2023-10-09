import UIBase from "./uibase";
import * as uiUtils from './uiutils'
import * as domUtils from '../core/domUtils'

class Mask extends UIBase {
  constructor(options){
    super()
    this.initOptions(options);
    this.initUIBase();
  }
  getHtmlTpl() {
    return '<div id="##" class="edui-mask %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);"></div>';
  }
  postRender() {
    var me = this;
    domUtils.on(window, "resize", function() {
      setTimeout(function() {
        if (!me.isHidden()) {
          me._fill();
        }
      });
    });
  }
  show(zIndex) {
    this._fill();
    this.getDom().style.display = "";
    this.getDom().style.zIndex = zIndex;
  }
  hide() {
    this.getDom().style.display = "none";
    this.getDom().style.zIndex = "";
  }
  isHidden() {
    return this.getDom().style.display == "none";
  }
  _onMouseDown() {
    return false;
  }
  _onClick(e, target) {
    this.fireEvent("click", e, target);
  }
  _fill() {
    var el = this.getDom();
    var vpRect = uiUtils.getViewportRect();
    el.style.width = vpRect.width + "px";
    el.style.height = vpRect.height + "px";
  }
}

export default Mask