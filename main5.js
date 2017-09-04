/**$函数 */

/* function $() {
    var els = [];
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element === 'string') {
            element = document.getElementById(element)
        }
        if (arguments.length === 1) {
            return element
        }
        els.push(element);

    }
    return els;
} */

(function () {
    function _$() {
        this.els = [];
        for (var i = 0; i < arguments[0].length; i++) {
            var element = arguments[0][i];
            if (typeof element === 'string') {
                element = document.getElementById(element)
                this.els.push(element);
            }
        }
    }

    _$.prototype = {
        each: function (fn) {
            for (var i = 0; i < this.els.length; i++) {
                var element = this.els[i];
                fn.call(this, element);
            }
            return this;
        },
        setStyles: function (prop, vl) {
            this.each(function (element) {
                element.style[prop] = vl
            });
            return this;
        },
        show: function () {
            this.setStyles('display', 'block');
            return this;
        },
        addEvent: function (type, fn) {
            var add = function (el) {
                if (window.addEventListener) {
                    el.addEventListener(type, fn, false);
                } else if (window.attachEvent) {
                    el.attachEvent('on' + type, fn)
                }
            };
            this.each(function (element) {
                add(element);
            });
            return this
        }
    }

    window.$ = function () {
        return new _$(arguments);
    }
})();

$('div','div1').setStyles('color','red').show().addEvent('click',function () {
    alert(123);
})
name = 'global';
window.API = window.API || function (n) {
    var name = 'hello';
    this.name = n;
    this.setName = function (i) {
        name = i;
        return this;
    };
    this.getName = function (cl) {
        cl.call(this)
        return this;
    }
};

var api = new API('my');

api.setName('new').getName(function () {
    console.log(this.name)
});