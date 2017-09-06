/**接口类 */
function Interface(name, methods) {
    this.name = name;
    this.methods = [];
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        if (typeof method !== 'string') {
            throw new Error('接口名必须为字符串')
        }
        this.methods.push(method);
    }
}

/**检测接口类 */
function ensureImplement(checkClass, interfaceClass) {
    if (arguments.length !== 2) {
        throw new Error('参数必须为2');
    }
    if (interfaceClass.constructor !== Interface) {
        throw new Error('第二个参数不是接口类');
    }
    for (var i = 0; i < interfaceClass.methods.length; i++) {
        var method = interfaceClass.methods[i];
        if (!method in checkClass || typeof checkClass[method] !== 'function') {
            throw new Error('接口检测失败');
        }
    }
}

/**extend扩展类 */
function extend(subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.superclass = superClass.prototype;
    subClass.prototype.constructor = subClass;
    if (superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}


/**XHR工厂 */

var ajaxHandle = new Interface('ajaxHander', ['request']);

var SimpleHandle = function () {};
SimpleHandle.prototype = {
    request: function (method, url, callback, postVal) {
        var xhr = this.createXhrObject();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback.success(xhr.responseText, xhr.responseXML);
                } else {
                    callback.failure(xhr.status);
                }
            }
        };
        xhr.open(method, url, true);
        if (method !== 'POST') {
            postVal = null;
        }
        xhr.send(postVal);

    },
    createXhrObject: function () {
        var xhrAll = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        var test;
        for (var i = 0; i < xhrAll.length; i++) {

            try {
                test = xhrAll[i]();
            } catch (e) {
                continue;
            }
            SimpleHandle.prototype.createXhrObject = xhrAll[i];
            return xhrAll[i]();
        }


    }
}

/**作为工厂的子类 - 离线类 */
var OfflineHandler = function () {
    this.storedRequest = [];
};
extend(OfflineHandler, SimpleHandle);
OfflineHandler.prototype.request = function (method, url, callback, postVal) {
    if (XhrManager.isOffline()) {
        this.storedRequest.push({
            method: method,
            url: url,
            callback: callback,
            postVal: postVal
        })
    } else {
        this.flushStoredRequest();
        OfflineHandler.superclass.request(method, url, callback, postVal);
    };
}
OfflineHandler.prototype.flushStoredRequest = function () {
    for (var i = 0; i < this.storedRequest.length; i++) {
        var req = this.storedRequest[i];
        OfflineHandler.superclass.request(req.method, req.url, req.callback, req.postVal);
    }
}

/**作为工厂模式的子类-高延迟类 */
var QueuedHandler = function () {
    this.queue = [];
    this.requestInProgress = false;
    this.retryDelay = 5;
};
extend(QueuedHandler, SimpleHandle);

QueuedHandler.prototype.request = function (method, url, callback, postVal, override) {
    if (this.requestInProgress && !override) {
        this.queue.push({
            method: method,
            url: url,
            callback: callback,
            postVal: postVal
        })
    } else {
        this.requestInProgress = true;
        var xhr = this.createXhrObject();
        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status == 200) {
                callback.success(xhr.responseText, xhr.responseXML);
                that.advanceQueue()
            } else {
                callback.failure(xhr.status);
                setTimeout(function () {
                    that.request(method, url, callback, postVal);
                }, that.retryDelay * 1000)
            }
        };
        xhr.open(method, url, callback, postVal);
        if (method !== 'POST') postVal = null;
        xhr.send(postVal);
    }
}

QueuedHandler.prototype.advanceQueue = function () {
    if (this.queue.length === 0) {
        this.requestInProgress = false;
        return;
    }
    var req = this.queue.shift();
    this.request(req.method, req.url, req.callback, req.postVal);
}

//负责生成最终类
var XhrManager = {
    createXhrHandler: function () {
        var xhr;
        if (this.isOffline()) {
            console.log('isOffline')
            xhr = new OfflineHandler()
        } else if (this.isHighLatency()) {
            console.log('isHighLatency')
            xhr = new QueuedHandler()
        } else {
            console.log('SimpleHandle')
            xhr = new SimpleHandle()
        }

        ensureImplement(xhr, ajaxHandle);

        return xhr;
    },
    isOffline: function () {
        var xhr = SimpleHandle.prototype.createXhrObject();
        var time = Date.now();
        var status;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            return (xhr.status >=200 && xhr.status <300) ? false : true;
        }
        xhr.open('get','1.txt',false);
        xhr.send();
    },
    isHighLatency: function () {
        var xhr = SimpleHandle.prototype.createXhrObject();
        var time = Date.now();
        var status;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                time = Date.now() - time;
                status = time < 200 ? false : true;
                console.log(time);
            }
        }

        xhr.open('get','1.txt',false);
        xhr.send();
        return status;
        
    }
}

var xhr = XhrManager.createXhrHandler();
xhr.request('GET','2.txt',{
    success:function (text) {
        console.log(text)
    },
    failure:function (e) {
        console.log(e)
    }    
})

