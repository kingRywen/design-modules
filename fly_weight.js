/**Car class, optimized as a flyweight */
var Car = function (make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}

Car.prototype = {
    getMake: function () {
        return this.make;
    },
    getModel: function () {
        return this.model;
    },
    getYear: function () {
        return this.year;
    }
}

/**car工厂函数 */
var CarFactory = (function () {
    var createdCars = {};

    return {
        createCar: function (make, model, year) {
            if (createdCars[make + '-' + model + '-' + year]) {
                return createdCars[make + '-' + model + '-' + year];
            }
            var car = new Car(make, model, year);
            createdCars[make + '-' + model + '-' + year] = car;
            return car;
        }
    }
})();

/**管理器 */
var CarRecordManage = (function () {
    var carRecordDatabase = {};

    return {
        addCarRecord: function (make, model, year, owner, tag, renewDate) {
            var car = CarFactory.createCar(make, model, year);
            carRecordDatabase[tag] = {
                owner: owner,
                renewDate: renewDate,
                car: car
            }
        },
        transferOwnership: function (tag, newOwner, newTag, newRewDate) {
            var record = carRecordDatabase[tag];
            record.owner = newOwner;
            record.renewDate = newRewDate;
        },
        renewRegistration: function (tag, newRewDate) {
            carRecordDatabase[tag].renewDate = newRewDate;
        },
        isRegistrationCurrent: function (tag) {
            var today = new Date();
            return today.getTime() - Date.parse(carRecordDatabase[tag].renewDate);
        }
    }
})();