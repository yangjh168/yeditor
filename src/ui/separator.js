import UIBase from "./uibase";

class Separator extends UIBase {
  uiName = "separator"
  constructor() {
    super()
    this.initOptions(options);
    this.initSeparator();
  }
  initSeparator() {
    this.initUIBase();
  }
  getHtmlTpl() {
    return '<div id="##" class="edui-box %%"></div>';
  }
}

export default Separator