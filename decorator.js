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
// bicycle = new FrameColorDecorator(bicycle, 'red');

console.log(bicycle.getPrice());