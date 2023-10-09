import browser from '../core/browser'
import * as domUtils from '../core/domUtils'
import * as uiUtils from '../ui/uiutils'

var TPL_STATEFUL =
'onmousedown="$$.Stateful_onMouseDown(event, this);"' +
' onmouseup="$$.Stateful_onMouseUp(event, this);"' +
(browser.ie
  ? ' onmouseenter="$$.Stateful_onMouseEnter(event, this);"' +
      ' onmouseleave="$$.Stateful_onMouseLeave(event, this);"'
  : ' onmouseover="$$.Stateful_onMouseOver(event, this);"' +
      ' onmouseout="$$.Stateful_onMouseOut(event, this);"');
/**
 *  @mixin stateful
 */
export default Base =>
    class extends Base {
      alwalysHoverable = false
      target = null //目标元素和this指向dom不一样
      Stateful_init() {
        this._Stateful_dGetHtmlTpl = this.getHtmlTpl;
        this.getHtmlTpl = this.Stateful_getHtmlTpl;
      }
      Stateful_getHtmlTpl(){
        var tpl = this._Stateful_dGetHtmlTpl();
        // 使用function避免$转义
        return tpl.replace(/stateful/g, function() {
          return TPL_STATEFUL;
        });
      }
      Stateful_onMouseEnter(evt, el) {
        this.target = el;
        if (!this.isDisabled() || this.alwalysHoverable) {
          this.addState("hover");
          this.fireEvent("over");
        }
      }
      Stateful_onMouseLeave(evt, el) {
        if (!this.isDisabled() || this.alwalysHoverable) {
          this.removeState("hover");
          this.removeState("active");
          this.fireEvent("out");
        }
      }
      Stateful_onMouseOver(evt, el) {
        var rel = evt.relatedTarget;
        if (!uiUtils.contains(el, rel) && el !== rel) {
          this.Stateful_onMouseEnter(evt, el);
        }
      }
      Stateful_onMouseOut(evt, el) {
        var rel = evt.relatedTarget;
        if (!uiUtils.contains(el, rel) && el !== rel) {
          this.Stateful_onMouseLeave(evt, el);
        }
      }
      Stateful_onMouseDown(evt, el) {
        if (!this.isDisabled()) {
          this.addState("active");
        }
      }
      Stateful_onMouseUp(evt, el) {
        if (!this.isDisabled()) {
          this.removeState("active");
        }
      }
      Stateful_postRender() {
        if (this.disabled && !this.hasState("disabled")) {
          this.addState("disabled");
        }
      }
      hasState(state) {
        return domUtils.hasClass(this.getStateDom(), "edui-state-" + state);
      }
      addState(state) {
        if (!this.hasState(state)) {
          this.getStateDom().className += " edui-state-" + state;
        }
      }
      removeState(state) {
        if (this.hasState(state)) {
          domUtils.removeClasses(this.getStateDom(), ["edui-state-" + state]);
        }
      }
      getStateDom() {
        return this.getDom("state");
      }
      isChecked() {
        return this.hasState("checked");
      }
      setChecked(checked) {
        if (!this.isDisabled() && checked) {
          this.addState("checked");
        } else {
          this.removeState("checked");
        }
      }
      isDisabled() {
        return this.hasState("disabled");
      }
      setDisabled(disabled) {
        if (disabled) {
          this.removeState("hover");
          this.removeState("checked");
          this.removeState("active");
          this.addState("disabled");
        } else {
          this.removeState("disabled");
        }
      }
    }
    