/**闭包单体模式  */

var scope = {};
scope.singleton = function () {

    /**私用属性 */
    var i = 5;

    return {
        i: i + 1,
        method1: function () {
            console.log('method1')
        },
        method2: function () {
            console.log(i);
        }
    }
}()

/**惰性加载实体 */

var scope2 = {}
scope2.Singleton = function () {
    var uniqueInstance;

    function constructor() {
        /**私用属性 */
        var i = 5;

        return {
            i: i + 1,
            method1: function () {
                console.log('method1')
            },
            method2: function () {
                console.log(i);
            }
        }
    }
    return {
        getInstance: function () {
            if (!uniqueInstance) uniqueInstance = constructor();
            return uniqueInstance;
        }
    }
}()
// 用法：必须调用getInstance()才会实例化对象，不会提前加载
// console.log(scope2.Singleton.getInstance().i);


/**XHR兼容做法 */
var singleXHR = function () {
    var standard = {
        createXHR: function () {
            return new XMLHttpRequest()
        }
    };
    var activeXNew = function () {
        return new ActiveXObject('Msxml2.XMLHTTP')
    };
    var activeXOld = function () {
        return new ActiveXObject('Microsoft.XMLHTTP')
    };
    var testObject;

    try {
        testObject = standard.createXHR()
        return standard;
    } catch (e) {
        try {
            testObject = activeXNew.createXHR();
            return activeXNew;
        } catch (e) {
            try {
                testObject = activeXOld.createXHR();
                return activeXOld;
            } catch (e) {
                throw new Error('No XHR Object.')
            }
        }
    }
}()