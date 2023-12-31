import UE from "../editor";
import { each, trim } from '@/utils/index'
import { isFunction, isArray } from '@/utils/index'
/**
 * Created with JetBrains PhpStorm.
 * User: campaign
 * Date: 10/8/13
 * Time: 6:15 PM
 * To change this template use File | Settings | File Templates.
 */
UE.plugin = (function() {
  var _plugins = {};
  return {
    register: function(pluginName, fn, oldOptionName, afterDisabled) {
      if (oldOptionName && isFunction(oldOptionName)) {
        afterDisabled = oldOptionName;
        oldOptionName = null;
      }
      _plugins[pluginName] = {
        optionName: oldOptionName || pluginName,
        execFn: fn,
        //当插件被禁用时执行
        afterDisabled: afterDisabled
      };
    },
    load: function(editor) {
      each(_plugins, function(plugin) {
        var _export = plugin.execFn.call(editor);
        if (editor.options[plugin.optionName] !== false) {
          if (_export) {
            //后边需要再做扩展
            each(_export, function(v, k) {
              switch (k.toLowerCase()) {
                case "shortcutkey":
                  editor.addshortcutkey(v);
                  break;
                case "bindevents":
                  each(v, function(fn, eventName) {
                    editor.addListener(eventName, fn);
                  });
                  break;
                case "bindmultievents":
                  each(isArray(v) ? v : [v], function(event) {
                    var types = trim(event.type).split(/\s+/);
                    each(types, function(eventName) {
                      editor.addListener(eventName, event.handler);
                    });
                  });
                  break;
                case "commands":
                  each(v, function(execFn, execName) {
                    editor.commands[execName] = execFn;
                  });
                  break;
                case "outputrule":
                  editor.addOutputRule(v);
                  break;
                case "inputrule":
                  editor.addInputRule(v);
                  break;
                case "defaultoptions":
                  editor.setOpt(v);
              }
            });
          }
        } else if (plugin.afterDisabled) {
          plugin.afterDisabled.call(editor);
        }
      });
      //向下兼容
      each(UE.plugins, function(plugin) {
        plugin.call(editor);
      });
    },
    run: function(pluginName, editor) {
      var plugin = _plugins[pluginName];
      if (plugin) {
        plugin.exeFn.call(editor);
      }
    }
  };
})();