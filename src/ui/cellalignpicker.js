import Stateful from "./stateful";
import UIBase from "./uibase";
import Popup from './popup'

class CellAlignPicker extends Stateful(UIBase) {
  constructor(options) {
    super()
    this.initOptions(options);
    this.initSelected();
    this.initCellAlignPicker();
  }
  //初始化选中状态， 该方法将根据传递进来的参数获取到应该选中的对齐方式图标的索引
  initSelected() {
    var status = {
      valign: {
        top: 0,
        middle: 1,
        bottom: 2
      },
      align: {
        left: 0,
        center: 1,
        right: 2
      },
      count: 3
    },
      result = -1;

    if (this.selected) {
      this.selectedIndex =
        status.valign[this.selected.valign] * status.count +
        status.align[this.selected.align];
    }
  }
  initCellAlignPicker() {
    this.initUIBase();
    this.Stateful_init();
  }
  getHtmlTpl() {
    var alignType = ["left", "center", "right"],
      COUNT = 9,
      tempClassName = null,
      tempIndex = -1,
      tmpl = [];

    for (var i = 0; i < COUNT; i++) {
      tempClassName = this.selectedIndex === i
        ? ' class="edui-cellalign-selected" '
        : "";
      tempIndex = i % 3;

      tempIndex === 0 && tmpl.push("<tr>");

      tmpl.push(
        '<td index="' +
          i +
          '" ' +
          tempClassName +
          ' stateful><div class="edui-icon edui-' +
          alignType[tempIndex] +
          '"></div></td>'
      );

      tempIndex === 2 && tmpl.push("</tr>");
    }

    return (
      '<div id="##" class="edui-cellalignpicker %%">' +
      '<div class="edui-cellalignpicker-body">' +
      '<table onclick="$$._onClick(event);">' +
      tmpl.join("") +
      "</table>" +
      "</div>" +
      "</div>"
    );
  }
  getStateDom() {
    return this.target;
  }
  _onClick(evt) {
    var target = evt.target || evt.srcElement;
    if (/icon/.test(target.className)) {
      this.items[target.parentNode.getAttribute("index")].onclick();
      Popup.postHide(evt);
    }
  }
  _UIBase_render = UIBase.prototype.render
}
export default CellAlignPicker