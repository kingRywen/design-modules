var Bicycle = function (name) {
    this.name = 'bicycle';
}

var Composite = new Interface('Composite', ['wash', 'getPrice']);

/**生成组件实例的类 */
Bicycle.prototype = {
    wash: function () {
        console.log('wash');
    },
    getPrice: function () {
        return 200;
    }
}

/**包装组件的超类 */
var BicycleDecorator = function (bicycle) {
    Interface.ensureImplement(bicycle, Composite);
    this.bicycle = bicycle;
}

BicycleDecorator.prototype = {
    wash: function () {
        return this.bicycle.wash();
    },
    getPrice: function () {
        return this.bicycle.getPrice();
    }
}


/**装饰子类1 */
var SubBicycle = function (bicycle) {
    SubBicycle.superclass.constructor.call(this, bicycle);
}

extend(SubBicycle, BicycleDecorator);

SubBicycle.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 20;
}

/**装饰子类2 */
var FrameColorDecorator = function (bicycle, color) {
    FrameColorDecorator.superclass.constructor.call(this,bicycle);
    this.color = color;
}

extend(FrameColorDecorator,BicycleDecorator);

FrameColorDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 100;
}


/**生成组件 */
var bicycle = new Bicycle();

/**包装一次 */
bicycle = new SubBicycle(bicycle);

/**再包装一次 */
bicycle = new FrameColorDecorator(bicycle, 'red');

console.log(bicycle.getPrice());


/**用于测试的类 */
var ListBuilder = function (parentEl, length) {
    this.parentEl = $(parentEl);
    this.length = length;
}

ListBuilder.prototype = {
    buildList: function () {
        var list = document.createElement('ul');
        this.parentEl.appendChild(list);
        for (var i = 0; i < this.length; i++) {
            var element = document.createElement('li');
            list.appendChild(element);
        }
    },
    removeList: function () {
        var childList = this.parentEl.childNodes[0];
        var del = this.parentEl.removeChild(childList);
        del = null;
    }
}

/**测试类装饰者 */
var Profile = function (component) {
    this.component = component;
    this.timer = {};

    var self = this;
    for (var key in self.component) {
        if (typeof self.component[key] !== 'function') {
            continue;
        }

        (function (methodName) {
            self[methodName] = function () {
                self.getStartTime(methodName);
                var returnValue = self.component[methodName].apply(self.component, arguments);
                self.showProgressTime(methodName);
                return returnValue;
            }
        })(key);
    }
}


Profile.prototype = {
    getStartTime: function (methodName) {
        this.timer[methodName] = new Date().getTime();
    },
    showProgressTime: function (methodName) {
        this.timer[methodName] = new Date().getTime() - this.timer[methodName];
        console.log(methodName + ' :用时' + this.timer[methodName] + 'ms.');
    }
}

var list = new ListBuilder('box',200000);
list = new Profile(list);

console.log(list.buildList());
console.log(list.removeList());
