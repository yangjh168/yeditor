import Stateful from "./stateful";
import UIBase from "./uibase";
import Popup from "./popup";
import CellAlignPicker from "./cellalignpicker";
import * as uiUtils from '../ui/uiutils'
import * as domUtils from '../core/domUtils'

class Menu extends Popup {
  items = null
  uiName = "menu"
  constructor(options) {
    super(options)
    this.initOptions(options);
    this.initMenu();
  }

  initMenu() {
    this.items = this.items || [];
    this.initPopup();
    this.initItems();
  }
  initItems() {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item == "-") {
        this.items[i] = this.getSeparator();
      } else if (!(item instanceof MenuItem)) {
        item.editor = this.editor;
        item.theme = this.editor.options.theme;
        this.items[i] = this.createItem(item);
      }
    }
  }
  getSeparator() {
    return menuSeparator;
  }
  createItem(item) {
    //新增一个参数menu, 该参数存储了menuItem所对应的menu引用
    item.menu = this;
    return new MenuItem(item);
  }
  _Popup_getContentHtmlTpl= Popup.prototype.getContentHtmlTpl
  getContentHtmlTpl() {
    if (this.items.length == 0) {
      return this._Popup_getContentHtmlTpl();
    }
    var buff = [];
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      buff[i] = item.renderHtml();
    }
    return '<div class="%%-body">' + buff.join("") + "</div>";
  }
  _Popup_postRender= Popup.prototype.postRender
  postRender() {
    var me = this;
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.ownerMenu = this;
      item.postRender();
    }
    domUtils.on(this.getDom(), "mouseover", function(evt) {
      evt = evt || event;
      var rel = evt.relatedTarget || evt.fromElement;
      var el = me.getDom();
      if (!uiUtils.contains(el, rel) && el !== rel) {
        me.fireEvent("over");
      }
    });
    this._Popup_postRender();
  }
  queryAutoHide(el) {
    if (el) {
      if (uiUtils.contains(this.getDom(), el)) {
        return false;
      }
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.queryAutoHide(el) === false) {
          return false;
        }
      }
    }
  }
  clearItems() {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      clearTimeout(item._showingTimer);
      clearTimeout(item._closingTimer);
      if (item.subMenu) {
        item.subMenu.destroy();
      }
    }
    this.items = [];
  }
  destroy() {
    if (this.getDom()) {
      domUtils.remove(this.getDom());
    }
    this.clearItems();
  }
  dispose() {
    this.destroy();
  }
}


class MenuItem extends Stateful(UIBase) {
  label = ""
  subMenu = null
  ownerMenu = null
  uiName = "menuitem"
  alwalysHoverable = true
  constructor(options) {
    super()
    this.initOptions(options);
    this.initUIBase();
    this.Stateful_init();
    if (this.subMenu && !(this.subMenu instanceof Menu)) {
      if (options.className && options.className.indexOf("aligntd") != -1) {
        var me = this;

        //获取单元格对齐初始状态
        this.subMenu.selected = this.editor.queryCommandValue("cellalignment");

        this.subMenu = new Popup({
          content: new CellAlignPicker(this.subMenu),
          parentMenu: me,
          editor: me.editor,
          destroy: function() {
            if (this.getDom()) {
              domUtils.remove(this.getDom());
            }
          }
        });
        this.subMenu.addListener("postRenderAfter", function() {
          domUtils.on(this.getDom(), "mouseover", function() {
            me.addState("opened");
          });
        });
      } else {
        this.subMenu = new Menu(this.subMenu);
      }
    }
  }
  getHtmlTpl() {
    return (
      '<div id="##" class="%%" stateful onclick="$$._onClick(event, this);">' +
      '<div class="%%-body">' +
      this.renderLabelHtml() +
      "</div>" +
      "</div>"
    );
  }
  postRender() {
    var me = this;
    this.addListener("over", function() {
      me.ownerMenu.fireEvent("submenuover", me);
      if (me.subMenu) {
        me.delayShowSubMenu();
      }
    });
    if (this.subMenu) {
      this.getDom().className += " edui-hassubmenu";
      this.subMenu.render();
      this.addListener("out", function() {
        me.delayHideSubMenu();
      });
      this.subMenu.addListener("over", function() {
        clearTimeout(me._closingTimer);
        me._closingTimer = null;
        me.addState("opened");
      });
      this.ownerMenu.addListener("hide", function() {
        me.hideSubMenu();
      });
      this.ownerMenu.addListener("submenuover", function(t, subMenu) {
        if (subMenu !== me) {
          me.delayHideSubMenu();
        }
      });
      this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide;
      this.subMenu.queryAutoHide = function(el) {
        if (el && uiUtils.contains(me.getDom(), el)) {
          return false;
        }
        return this._bakQueryAutoHide(el);
      };
    }
    this.getDom().style.tabIndex = "-1";
    uiUtils.makeUnselectable(this.getDom());
    this.Stateful_postRender();
  }
  delayShowSubMenu() {
    var me = this;
    if (!me.isDisabled()) {
      me.addState("opened");
      clearTimeout(me._showingTimer);
      clearTimeout(me._closingTimer);
      me._closingTimer = null;
      me._showingTimer = setTimeout(function() {
        me.showSubMenu();
      }, 250);
    }
  }
  delayHideSubMenu() {
    var me = this;
    if (!me.isDisabled()) {
      me.removeState("opened");
      clearTimeout(me._showingTimer);
      if (!me._closingTimer) {
        me._closingTimer = setTimeout(function() {
          if (!me.hasState("opened")) {
            me.hideSubMenu();
          }
          me._closingTimer = null;
        }, 400);
      }
    }
  }
  renderLabelHtml() {
    return (
      '<div class="edui-arrow"></div>' +
      '<div class="edui-box edui-icon"></div>' +
      '<div class="edui-box edui-label %%-label">' +
      (this.label || "") +
      "</div>"
    );
  }
  getStateDom() {
    return this.getDom();
  }
  queryAutoHide(el) {
    if (this.subMenu && this.hasState("opened")) {
      return this.subMenu.queryAutoHide(el);
    }
  }
  _onClick(event, this_) {
    if (this.hasState("disabled")) return;
    if (this.fireEvent("click", event, this_) !== false) {
      if (this.subMenu) {
        this.showSubMenu();
      } else {
        Popup.postHide(event);
      }
    }
  }
  showSubMenu() {
    var rect = uiUtils.getClientRect(this.getDom());
    rect.right -= 5;
    rect.left += 2;
    rect.width -= 7;
    rect.top -= 4;
    rect.bottom += 4;
    rect.height += 8;
    this.subMenu.showAnchorRect(rect, true, true);
  }
  hideSubMenu() {
    this.subMenu.hide();
  }
}

export {
  Menu,
  MenuItem
}