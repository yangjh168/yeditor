import SplitButton from "./splitbutton";
import { Menu } from './menu'

class MenuButton extends SplitButton {
  constructor(options){
    super(options)
    this.initOptions(options);
    this.initMenuButton();
  }

  initMenuButton() {
    var me = this;
    this.uiName = "menubutton";
    this.popup = new Menu({
      items: me.items,
      className: me.className,
      editor: me.editor
    });
    this.popup.addListener("show", function() {
      var list = this;
      for (var i = 0; i < list.items.length; i++) {
        list.items[i].removeState("checked");
        if (list.items[i].value == me._value) {
          list.items[i].addState("checked");
          this.value = me._value;
        }
      }
    });
    // this.initSplitButton(); SplitButton初始化时会调用
  }
  setValue(value) {
    this._value = value;
  }
}
export default MenuButton