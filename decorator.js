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


/**最终使用的继承子类 */
var SubBicycle = function (bicycle) {
    SubBicycle.superclass.constructor.call(this, bicycle);
}

extend(SubBicycle, BicycleDecorator);

SubBicycle.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 20
}

var bicycle = new Bicycle();

bicycle = new SubBicycle(bicycle);

console.log(bicycle.getPrice());