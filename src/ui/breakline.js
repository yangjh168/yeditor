import UIBase from "./uibase";

class Breakline extends UIBase {
  uiName = "Breakline"
  constructor(options) {
    super()
    this.initOptions(options);
    this.initSeparator();
  }
  initSeparator() {
    this.initUIBase();
  }
  getHtmlTpl() {
    return "<br/>";
  }
}
export default Breakline