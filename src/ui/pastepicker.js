import UIBase from "./uibase";
import Stateful from './stateful'
import * as domUtils from '../core/domUtils'
import * as uiUtils from '../ui/uiutils'

class PastePicker extends Stateful(UIBase) {
  constructor(options) {
    super()
    this.initOptions(options);
    this.initPastePicker();
  }
  _UIBase_render = UIBase.prototype.render
  initPastePicker() {
    this.initUIBase();
    this.Stateful_init();
  }
  getHtmlTpl() {
    return (
      '<div class="edui-pasteicon" onclick="$$._onClick(this)"></div>' +
      '<div class="edui-pastecontainer">' +
      '<div class="edui-title">' +
      this.editor.getLang("pasteOpt") +
      "</div>" +
      '<div class="edui-button">' +
      '<div title="' +
      this.editor.getLang("pasteSourceFormat") +
      '" onclick="$$.format(false)" stateful>' +
      '<div class="edui-richtxticon"></div></div>' +
      '<div title="' +
      this.editor.getLang("tagFormat") +
      '" onclick="$$.format(2)" stateful>' +
      '<div class="edui-tagicon"></div></div>' +
      '<div title="' +
      this.editor.getLang("pasteTextFormat") +
      '" onclick="$$.format(true)" stateful>' +
      '<div class="edui-plaintxticon"></div></div>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }
  getStateDom() {
    return this.target;
  }
  format(param) {
    this.editor.ui._isTransfer = true;
    this.editor.fireEvent("pasteTransfer", param);
  }
  _onClick(cur) {
    var node = domUtils.getNextDomNode(cur),
      screenHt = uiUtils.getViewportRect().height,
      subPop = uiUtils.getClientRect(node);

    if (subPop.top + subPop.height > screenHt)
      node.style.top = -subPop.height - cur.offsetHeight + "px";
    else node.style.top = "";

    if (/hidden/gi.test(domUtils.getComputedStyle(node, "visibility"))) {
      node.style.visibility = "visible";
      domUtils.addClass(cur, "edui-state-opened");
    } else {
      node.style.visibility = "hidden";
      domUtils.removeClasses(cur, "edui-state-opened");
    }
  }
}

export default PastePicker