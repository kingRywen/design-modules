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


/**XHR工厂 */

var ajaxHandle = new Interface('ajaxHander', ['request', 'createXhrObject']);

var SimpleHandle = function () {};
SimpleHandle.prototype = {
    request: function (method, url, callback, postVal) {
        var xhr = this.createXhrObject();
        // var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback.success(xhr.responseText, xhr.responseXML);
                }else{
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
            this.createXhrObject = xhrAll[i];
            return xhrAll[i]();
        }
        
        
    }
}

var simpleXhr = new SimpleHandle();
ensureImplement(simpleXhr, ajaxHandle);

var callback = {
    success: function (i) {
        console.log(i);
    },
    failure: function (i) {
        console.log(i);
    }
}
simpleXhr.request('get','1.txt',callback)