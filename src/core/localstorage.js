

const LOCAL_FILE = "localStorage"

class LocalStorage {
  storage
  constructor() {
    this.storage = window.localStorage || this._getUserData() || null
  }

  _getUserData() {
    var container = document.createElement("div");
    container.style.display = "none";
  
    if (!container.addBehavior) {
      return null;
    }
  
    container.addBehavior("#default#userdata");
  
    return {
      getItem: function(key) {
        var result = null;
  
        try {
          document.body.appendChild(container);
          container.load(LOCAL_FILE);
          result = container.getAttribute(key);
          document.body.removeChild(container);
        } catch (e) {}
  
        return result;
      },
  
      setItem: function(key, value) {
        document.body.appendChild(container);
        container.setAttribute(key, value);
        container.save(LOCAL_FILE);
        document.body.removeChild(container);
      },
  
      //// 暂时没有用到
      //clear: function () {
      //
      //    var expiresTime = new Date();
      //    expiresTime.setFullYear(expiresTime.getFullYear() - 1);
      //    document.body.appendChild(container);
      //    container.expires = expiresTime.toUTCString();
      //    container.save(LOCAL_FILE);
      //    document.body.removeChild(container);
      //
      //},
  
      removeItem: function(key) {
        document.body.appendChild(container);
        container.removeAttribute(key);
        container.save(LOCAL_FILE);
        document.body.removeChild(container);
      }
    };
  }

  saveLocalData(key, data) {
    if (this.storage && data) {
      this.storage.setItem(key, data);
      return true;
    }
  
    return false;
  }
  
  getLocalData(key) {
    if (this.storage) {
      return this.storage.getItem(key);
    }
  
    return null;
  }
  
  removeItem(key) {
    this.storage && this.storage.removeItem(key);
  }
}

export default new LocalStorage()