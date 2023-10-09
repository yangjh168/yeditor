import UIBase from "./uibase";
import * as uiUtils from '../ui/uiutils'

class TablePicker extends UIBase {
  defaultNumRows = 10
  defaultNumCols = 10
  maxNumRows = 20
  maxNumCols = 20
  numRows = 10
  numCols = 10
  lengthOfCellSide = 22
  constructor(options) {
    super()
    this.initOptions(options);
    this.initTablePicker();
  }
  initTablePicker() {
    this.initUIBase();
  }
  getHtmlTpl() {
    var me = this;
    return (
      '<div id="##" class="edui-tablepicker %%">' +
      '<div class="edui-tablepicker-body">' +
      '<div class="edui-infoarea">' +
      '<span id="##_label" class="edui-label"></span>' +
      "</div>" +
      '<div class="edui-pickarea"' +
      ' onmousemove="$$._onMouseMove(event, this);"' +
      ' onmouseover="$$._onMouseOver(event, this);"' +
      ' onmouseout="$$._onMouseOut(event, this);"' +
      ' onclick="$$._onClick(event, this);"' +
      ">" +
      '<div id="##_overlay" class="edui-overlay"></div>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }
  _UIBase_render = UIBase.prototype.render
  render(holder) {
    this._UIBase_render(holder);
    this.getDom("label").innerHTML =
      "0" +
      this.editor.getLang("t_row") +
      " x 0" +
      this.editor.getLang("t_col");
  }
  _track(numCols, numRows) {
    var style = this.getDom("overlay").style;
    var sideLen = this.lengthOfCellSide;
    style.width = numCols * sideLen + "px";
    style.height = numRows * sideLen + "px";
    var label = this.getDom("label");
    label.innerHTML =
      numCols +
      this.editor.getLang("t_col") +
      " x " +
      numRows +
      this.editor.getLang("t_row");
    this.numCols = numCols;
    this.numRows = numRows;
  }
  _onMouseOver(evt, el) {
    var rel = evt.relatedTarget || evt.fromElement;
    if (!uiUtils.contains(el, rel) && el !== rel) {
      this.getDom("label").innerHTML =
        "0" +
        this.editor.getLang("t_col") +
        " x 0" +
        this.editor.getLang("t_row");
      this.getDom("overlay").style.visibility = "";
    }
  }
  _onMouseOut(evt, el) {
    var rel = evt.relatedTarget || evt.toElement;
    if (!uiUtils.contains(el, rel) && el !== rel) {
      this.getDom("label").innerHTML =
        "0" +
        this.editor.getLang("t_col") +
        " x 0" +
        this.editor.getLang("t_row");
      this.getDom("overlay").style.visibility = "hidden";
    }
  }
  _onMouseMove(evt, el) {
    var style = this.getDom("overlay").style;
    var offset = uiUtils.getEventOffset(evt);
    var sideLen = this.lengthOfCellSide;
    var numCols = Math.ceil(offset.left / sideLen);
    var numRows = Math.ceil(offset.top / sideLen);
    this._track(numCols, numRows);
  }
  _onClick() {
    this.fireEvent("picktable", this.numCols, this.numRows);
  }
}
export default TablePicker