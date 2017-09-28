/**
 * 继承函数
 * @param {*constructor} subClass 继承子类
 * @param {*constructor} superClass 继承父类
 */
function extend(subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F;
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

/**
 * 事件绑定
 * @param {*dom} el 绑定事件的元素
 * @param {*string} type 事件类型
 * @param {*function} fn 回调函数
 */
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else {
        el.attachEvent('on' + type, fn)
    }
}


/**
 * 接口类
 * @param {*string} name 接口名
 * @param {*Array} methods 接口集合
 */
function Interface(name, methods) {
    this.name = name;
    this.methods = [];
    if (!methods instanceof Array) {
        throw new Error('第二个参数必须是数组');
    }
    if (arguments.length !== 2) {
        throw new Error('只能接受两个参数');
    }
    for (var i = 0; i < methods.length; i++) {
        var element = methods[i];
        if (typeof element !== 'string') {
            throw new Error('接口集数组元素为字符串');
        }
        this.methods.push(element);
    }
}

/**
 * 接口检测函数
 */
Interface.ensureImplement = function (checkElement) {
    if (arguments.length < 2) {
        throw new Error('参数必须多于两个');
    }
    for (var i = 1; i < arguments.length; i++) {
        var element = arguments[i];
        if (element.constructor !== Interface) {
            throw new Error('检测用的参数必须是Interface的实例');
        }
        for (var j = 0; j < element.methods.length; j++) {
            var method = element.methods[j];
            if (!method in checkElement || typeof checkElement[method] !== 'function') {
                throw new Error('接口检测失败');
            }
        }
    }
}

/** $函数 */
window.$ = function (id) {
    return document.getElementById(id);
}