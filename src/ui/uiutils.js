import * as domUtils from '../core/domUtils'
import browser from '../core/browser'

var magic = "$EDITORUI";
var root = (window[magic] = {});
var uidMagic = "ID" + magic;
var uidCount = 0;

export function uid(obj) {
  return obj ? obj[uidMagic] || (obj[uidMagic] = ++uidCount) : ++uidCount;
}
export function hook(fn, callback) {
  var dg;
  if (fn && fn._callbacks) {
    dg = fn;
  } else {
    dg = function() {
      var q;
      if (fn) {
        q = fn.apply(this, arguments);
      }
      var callbacks = dg._callbacks;
      var k = callbacks.length;
      while (k--) {
        var r = callbacks[k].apply(this, arguments);
        if (q === undefined) {
          q = r;
        }
      }
      return q;
    };
    dg._callbacks = [];
  }
  dg._callbacks.push(callback);
  return dg;
}
export function createElementByHtml(html) {
  var el = document.createElement("div");
  el.innerHTML = html;
  el = el.firstChild;
  el.parentNode.removeChild(el);
  return el;
}
export function getViewportElement() {
  return browser.ie && browser.quirks
    ? document.body
    : document.documentElement;
}
export function getClientRect(element) {
  var bcr;
  //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
  try {
    bcr = element.getBoundingClientRect();
  } catch (e) {
    bcr = { left: 0, top: 0, height: 0, width: 0 };
  }
  var rect = {
    left: Math.round(bcr.left),
    top: Math.round(bcr.top),
    height: Math.round(bcr.bottom - bcr.top),
    width: Math.round(bcr.right - bcr.left)
  };
  var doc;
  while (
    (doc = element.ownerDocument) !== document &&
    (element = domUtils.getWindow(doc).frameElement)
  ) {
    bcr = element.getBoundingClientRect();
    rect.left += bcr.left;
    rect.top += bcr.top;
  }
  rect.bottom = rect.top + rect.height;
  rect.right = rect.left + rect.width;
  return rect;
}
export function getViewportRect() {
  var viewportEl = uiUtils.getViewportElement();
  var width = (window.innerWidth || viewportEl.clientWidth) | 0;
  var height = (window.innerHeight || viewportEl.clientHeight) | 0;
  return {
    left: 0,
    top: 0,
    height: height,
    width: width,
    bottom: height,
    right: width
  };
}
export function setViewportOffset(element, offset) {
  var rect;
  var fixedLayer = uiUtils.getFixedLayer();
  if (element.parentNode === fixedLayer) {
    element.style.left = offset.left + "px";
    element.style.top = offset.top + "px";
  } else {
    domUtils.setViewportOffset(element, offset);
  }
}
export function getEventOffset(evt) {
  var el = evt.target || evt.srcElement;
  var rect = uiUtils.getClientRect(el);
  var offset = uiUtils.getViewportOffsetByEvent(evt);
  return {
    left: offset.left - rect.left,
    top: offset.top - rect.top
  };
}
export function getViewportOffsetByEvent(evt) {
  var el = evt.target || evt.srcElement;
  var frameEl = domUtils.getWindow(el).frameElement;
  var offset = {
    left: evt.clientX,
    top: evt.clientY
  };
  if (frameEl && el.ownerDocument !== document) {
    var rect = uiUtils.getClientRect(frameEl);
    offset.left += rect.left;
    offset.top += rect.top;
  }
  return offset;
}
export function setGlobal(id, obj) {
  root[id] = obj;
  return magic + '["' + id + '"]';
}
export function unsetGlobal(id) {
  delete root[id];
}
export function copyAttributes(tgt, src) {
  var attributes = src.attributes;
  var k = attributes.length;
  while (k--) {
    var attrNode = attributes[k];
    if (
      attrNode.nodeName != "style" &&
      attrNode.nodeName != "class" &&
      (!browser.ie || attrNode.specified)
    ) {
      tgt.setAttribute(attrNode.nodeName, attrNode.nodeValue);
    }
  }
  if (src.className) {
    domUtils.addClass(tgt, src.className);
  }
  if (src.style.cssText) {
    tgt.style.cssText += ";" + src.style.cssText;
  }
}
export function removeStyle(el, styleName) {
  if (el.style.removeProperty) {
    el.style.removeProperty(styleName);
  } else if (el.style.removeAttribute) {
    el.style.removeAttribute(styleName);
  } else throw "";
}
export function contains(elA, elB) {
  return (
    elA &&
    elB &&
    (elA === elB
      ? false
      : elA.contains
        ? elA.contains(elB)
        : elA.compareDocumentPosition(elB) & 16)
  );
}
export function startDrag(evt, callbacks, doc) {
  var doc = doc || document;
  var startX = evt.clientX;
  var startY = evt.clientY;
  function handleMouseMove(evt) {
    var x = evt.clientX - startX;
    var y = evt.clientY - startY;
    callbacks.ondragmove(x, y, evt);
    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {
      evt.cancelBubble = true;
    }
  }
  if (doc.addEventListener) {
    function handleMouseUp(evt) {
      doc.removeEventListener("mousemove", handleMouseMove, true);
      doc.removeEventListener("mouseup", handleMouseUp, true);
      window.removeEventListener("mouseup", handleMouseUp, true);
      callbacks.ondragstop();
    }
    doc.addEventListener("mousemove", handleMouseMove, true);
    doc.addEventListener("mouseup", handleMouseUp, true);
    window.addEventListener("mouseup", handleMouseUp, true);

    evt.preventDefault();
  } else {
    var elm = evt.srcElement;
    elm.setCapture();
    function releaseCaptrue() {
      elm.releaseCapture();
      elm.detachEvent("onmousemove", handleMouseMove);
      elm.detachEvent("onmouseup", releaseCaptrue);
      elm.detachEvent("onlosecaptrue", releaseCaptrue);
      callbacks.ondragstop();
    }
    elm.attachEvent("onmousemove", handleMouseMove);
    elm.attachEvent("onmouseup", releaseCaptrue);
    elm.attachEvent("onlosecaptrue", releaseCaptrue);
    evt.returnValue = false;
  }
  callbacks.ondragstart();
}
export function getFixedLayer() {
  var layer = document.getElementById("edui_fixedlayer");
  if (layer == null) {
    layer = document.createElement("div");
    layer.id = "edui_fixedlayer";
    document.body.appendChild(layer);
    if (browser.ie && browser.version <= 8) {
      layer.style.position = "absolute";
      bindFixedLayer();
      setTimeout(updateFixedOffset);
    } else {
      layer.style.position = "fixed";
    }
    layer.style.left = "0";
    layer.style.top = "0";
    layer.style.width = "0";
    layer.style.height = "0";
  }
  return layer;
}
export function makeUnselectable(element) {
  if (browser.opera || (browser.ie && browser.version < 9)) {
    element.unselectable = "on";
    if (element.hasChildNodes()) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeType == 1) {
          uiUtils.makeUnselectable(element.childNodes[i]);
        }
      }
    }
  } else {
    if (element.style.MozUserSelect !== undefined) {
      element.style.MozUserSelect = "none";
    } else if (element.style.WebkitUserSelect !== undefined) {
      element.style.WebkitUserSelect = "none";
    } else if (element.style.KhtmlUserSelect !== undefined) {
      element.style.KhtmlUserSelect = "none";
    }
  }
}

function updateFixedOffset() {
  var layer = document.getElementById("edui_fixedlayer");
  uiUtils.setViewportOffset(layer, {
    left: 0,
    top: 0
  });
  //        layer.style.display = 'none';
  //        layer.style.display = 'block';

  //#trace: 1354
  //        setTimeout(updateFixedOffset);
}
function bindFixedLayer(adjOffset) {
  domUtils.on(window, "scroll", updateFixedOffset);
  domUtils.on(
    window,
    "resize",
    baidu.editor.utils.defer(updateFixedOffset, 0, true)
  );
}