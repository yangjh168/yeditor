import Popup from "./popup";
import SplitButton from "./splitbutton";

class MultiMenuPop extends SplitButton {
  constructor(options){
    super(options)
    this.initOptions(options);
    this.initMultiMenu();
  }

  initMultiMenu() {
    var me = this;
    this.popup = new Popup({
      content: "",
      editor: me.editor,
      iframe_rendered: false,
      onshow: function() {
        if (!this.iframe_rendered) {
          this.iframe_rendered = true;
          this.getDom("content").innerHTML =
            '<iframe id="' +
            me.id +
            '_iframe" src="' +
            me.iframeUrl +
            '" frameborder="0"></iframe>';
          me.editor.container.style.zIndex &&
            (this.getDom().style.zIndex =
              me.editor.container.style.zIndex * 1 + 1);
        }
      }
      // canSideUp:false,
      // canSideLeft:false
    });
    this.onbuttonclick = function() {
      this.showPopup();
    };
    // this.initSplitButton(); SplitButton初始化时会调用
  }
}
export default MultiMenuPop