import EventBase from "./EventBase";
import { isFunction } from '../utils/validate'
import * as utils from '../utils/index'
import ajax from './ajax'

var eval2 = eval;

class LoadConfig extends EventBase {
  /**
   * 加载服务器配置
   */
  loadServerConfig() {
    var me = this;
    setTimeout(function() {
      try {
        me.options.imageUrl &&
          me.setOpt(
            "serverUrl",
            me.options.imageUrl.replace(
              /^(.*[\/]).+([\.].+)$/,
              "$1controller$2"
            )
          );
  
        var configUrl = me.getActionUrl("config"),
          isJsonp = utils.isCrossDomainUrl(configUrl);
  
        /* 发出ajax请求 */
        me._serverConfigLoaded = false;
        console.log('configUrl', configUrl)
        configUrl &&
          ajax.request(configUrl, {
            method: "GET",
            dataType: isJsonp ? "jsonp" : "",
            onsuccess: function(r) {
              try {
                var config = isJsonp ? r : eval2("(" + r.responseText + ")");
                utils.extend(me.options, config);
                me.fireEvent("serverConfigLoaded");
                me._serverConfigLoaded = true;
              } catch (e) {
                showErrorMsg(me.getLang("loadconfigFormatError"));
              }
            },
            onerror: function() {
              showErrorMsg(me.getLang("loadconfigHttpError"));
            }
          });
      } catch (e) {
        console.log(e)
        showErrorMsg(me.getLang("loadconfigError"));
      }
    });
  
    function showErrorMsg(msg) {
      console && console.error(msg);
      //me.fireEvent('showMessage', {
      //    'title': msg,
      //    'type': 'error'
      //});
    }
  }
  
  isServerConfigLoaded() {
    var me = this;
    return me._serverConfigLoaded || false;
  }
  
  afterConfigReady(handler) {
    if (!handler || !isFunction(handler)) return;
    var me = this;
    var readyHandler = function() {
      handler.apply(me, arguments);
      me.removeListener("serverConfigLoaded", readyHandler);
    };
  
    if (me.isServerConfigLoaded()) {
      handler.call(me, "serverConfigLoaded");
    } else {
      me.addListener("serverConfigLoaded", readyHandler);
    }
  }
}
export default LoadConfig