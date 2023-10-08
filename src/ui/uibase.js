import EventBase from "../core/EventBase";
import * as utils from '../utils'
import * as uiUtils from '../ui/uiutils'
import * as domUtils from '../core/domUtils'

class UIBase extends EventBase {
  className = ""
  uiName = ""
  initOptions(options) {
    var me = this;
    for (var k in options) {
      me[k] = options[k];
    }
    this.id = this.id || "edui" + uiUtils.uid();
  }
  initUIBase() {
    this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
  }
  render(holder) {
    var html = this.renderHtml();
    var el = uiUtils.createElementByHtml(html);

    //by xuheng 给每个node添加class
    var list = domUtils.getElementsByTagName(el, "*");
    var theme = "edui-" + (this.theme || this.editor.options.theme);
    var layer = document.getElementById("edui_fixedlayer");
    for (var i = 0, node; (node = list[i++]); ) {
      domUtils.addClass(node, theme);
    }
    domUtils.addClass(el, theme);
    if (layer) {
      layer.className = "";
      domUtils.addClass(layer, theme);
    }

    var seatEl = this.getDom();
    if (seatEl != null) {
      seatEl.parentNode.replaceChild(el, seatEl);
      uiUtils.copyAttributes(el, seatEl);
    } else {
      if (typeof holder == "string") {
        holder = document.getElementById(holder);
      }
      holder = holder || uiUtils.getFixedLayer();
      domUtils.addClass(holder, theme);
      holder.appendChild(el);
    }
    this.postRender();
  }
  getDom(name) {
    if (!name) {
      return document.getElementById(this.id);
    } else {
      return document.getElementById(this.id + "_" + name);
    }
  }
  postRender() {
    this.fireEvent("postrender");
  }
  getHtmlTpl() {
    return "";
  }
  formatHtml(tpl) {
    var prefix = "edui-" + this.uiName;
    return tpl
      .replace(/##/g, this.id)
      .replace(/%%-/g, this.uiName ? prefix + "-" : "")
      .replace(/%%/g, (this.uiName ? prefix : "") + " " + this.className)
      .replace(/\$\$/g, this._globalKey);
  }
  renderHtml() {
    return this.formatHtml(this.getHtmlTpl());
  }
  dispose() {
    var box = this.getDom();
    if (box) domUtils.remove(box);
    uiUtils.unsetGlobal(this.id);
  }
}

export default UIBase