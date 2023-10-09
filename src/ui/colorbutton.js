import SplitButton from './splitbutton'
import * as uiUtils from './uiutils'
import Popup from './popup'
import ColorPicker from './colorpicker'

class ColorButton extends SplitButton {
  constructor(options) {
    super(options)
    this.initOptions(options);
    this.initColorButton();
  }

  initColorButton() {
    var me = this;
    this.popup = new Popup({
      content: new ColorPicker({
        noColorText: me.editor.getLang("clearColor"),
        editor: me.editor,
        onpickcolor: function(t, color) {
          me._onPickColor(color);
        },
        onpicknocolor: function(t, color) {
          me._onPickNoColor(color);
        }
      }),
      editor: me.editor
    });
    // this.initSplitButton(); SplitButton初始化时会调用
  }
  _SplitButton_postRender = SplitButton.prototype.postRender
  postRender() {
    this._SplitButton_postRender();
    this.getDom("button_body").appendChild(
      uiUtils.createElementByHtml(
        '<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>'
      )
    );
    this.getDom().className += " edui-colorbutton";
  }
  setColor(color) {
    this.getDom("colorlump").style.backgroundColor = color;
    this.color = color;
  }
  _onPickColor(color) {
    if (this.fireEvent("pickcolor", color) !== false) {
      this.setColor(color);
      this.popup.hide();
    }
  }
  _onPickNoColor(color) {
    if (this.fireEvent("picknocolor") !== false) {
      this.popup.hide();
    }
  }
}
export default ColorButton