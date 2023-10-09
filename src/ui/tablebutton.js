import SplitButton from "./splitbutton";
import TablePicker from "./tablepicker";
import Popup from "./popup";

class TableButton extends SplitButton {
  constructor(options) {
    super(options)
    this.initOptions(options);
    this.initTableButton();
  }
  initTableButton() {
    var me = this;
    this.popup = new Popup({
      content: new TablePicker({
        editor: me.editor,
        onpicktable: function(t, numCols, numRows) {
          me._onPickTable(numCols, numRows);
        }
      }),
      editor: me.editor
    });
    // this.initSplitButton(); SplitButton初始化时会调用
  }
  _onPickTable(numCols, numRows) {
    if (this.fireEvent("picktable", numCols, numRows) !== false) {
      this.popup.hide();
    }
  }
}
export default TableButton