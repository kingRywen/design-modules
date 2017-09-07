/**method 添加方法函数 */
Function.prototype.method = function (name, fn) {
    this.prototype[name] = fn;
    return this;
}

/**
 * 发送请求函数
 */
var asyncRequest = function () {

    var handleReadyState = function (o, cl) {
        var timer = window.setInterval(function () {
            if (o && o.readyState === 4) {
                window.clearInterval(timer);
                if (cl) {
                    cl(o.responseText);
                }
            }
        }, 50)
    }

    var createXhr = function () {
        var xhr;

        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            try {
                xhr = new ActiveXObject();
            } catch (e) {
                throw new Error('No ajax.')
            }
        }

        createXhr = function () {
            return xhr;
        }
        return xhr;
    }

    return function (method, url, cl, postVal) {
        var xhr = createXhr();
        xhr.open(method, url, true);
        handleReadyState(xhr, cl);
        xhr.send(postVal || null);
        return xhr;
    }
}();

/* 
测试 asyncRequest()
asyncRequest('GET', '1.txt', function (msg) {
    console.log(msg)
}) */

/**
 * 数组的forEach, filter,原生实现
 */
if (!Array.prototype.forEach) {
    Array.method('forEach', function (fn, scope) {
        var scope = scope || window;
        for (var i = 0; i < this.length; i++) {
            var element = this[i];
            fn.call(scope, element, i, this);
        }
    })
}

if (!Array.prototype.filter) {
    Array.method('filter', function (fn, scope) {
        var scope = scope || window;
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            var element = this[i];
            if (!fn.call(scope, element, i, this)) {
                continue;
            }
            arr.push.element;
        }
        return arr;
    })
}

/**
 * 观察者系统
 * DED 命名空间
 * DED = {
 *  Queue:构造函数
 *  util:{
 *    Observer:构造函数
 *  }
 * }
 */
window.DED = window.DED || {};
DED.util = DED.util || {};
DED.util.Observer = function () {
    this.fns = [];
}

DED.util.Observer.prototype = {
    subscribe: function (fn) {
        this.fns.push(fn);
    },
    unSubscribe: function (fn) {
        this.fns.filter(function (el) {
            if (el !== fn) {
                return el;
            }
        })
    },
    fire: function (o) {
        this.fns.forEach(function (el) {
            el(o);
        })
    }
}


/**
 * 队列任务
 */
DED.Queue = function () {
    this.queue = [];

    this.onComplete = new DED.util.Observer; // {fns:[]}
    this.onFailure = new DED.util.Observer; // {fns:[]}
    this.onFlush = new DED.util.Observer; // {fns:[]}

    this.retryCount = 3;
    this.currentRetry = 0;
    this.paused = false;
    this.timeout = 5000;
    this.conn = {};
    this.timer = {};

};

DED.Queue.method('flush', function () {
        if (!this.queue.length > 0) {
            return;
        }
        if (this.paused) {
            this.paused = false;
            return;
        }
        var that = this;
        this.currentRetry++;
        var abort = function () {
            that.conn.abort(); // 如果超时，终止当前的请求
            if (that.currentRetry == that.retryCount) {
                that.onFailure.fire();
                that.currentRetry = 0;
            } else {
                that.flush();
            }
        };

        this.timer = window.setTimeout(abort, this.timeout);
        var callback = function (o) {
            window.clearInterval(that.timer);
            that.currentRetry = 0;
            that.queue.shift();
            that.onFlush.fire(o.responseText);
            console.log(that.onFlush);
            if (that.queue.length == 0) {
                that.onComplete.fire();
                return;
            }
            that.flush();
        };
        // 处理queue中第一个请求，并返回xhr对象
        this.conn = asyncRequest(this.queue[0]['method'], this.queue[0]['url'], callback, this.queue[0]['params']);
    })
    .method('setRetryCount', function (count) {
        this.retryCount = count;
    })
    .method('setTimeout', function (time) {
        this.timeout = time;
    })
    .method('add', function (o) {
        this.queue.push(o);
    })
    .method('pause', function () {
        this.paused = true;
    })
    .method('dequeue', function () {
        this.queue.pop();
    })
    .method('clear', function () {
        this.queue = [];
    });

var de = new DED.Queue();

de.add({
    method:'GET',
    url:'2.txt'
})

de.add({
    method:'GET',
    url:'1.txt'
})

de.flush();