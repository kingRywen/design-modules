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
    if (arguments.length < 2) {
        throw new Error('参数必须为2');
    }
    for (var i = 1; i < arguments.length; i++) {
        var element = arguments[i];
        if (element.constructor !== Interface) {
            throw new Error('检测提供的不是接口类');
        }
        for (var j = 0; j < element.methods.length; j++) {
            var method = element.methods[j];
            if (!method in checkClass || typeof checkClass[method] !== 'function') {
                throw new Error('接口检测失败');
            }
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

/**事件绑定 */
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}

/**setCookie 设置缓存 */
function setCookie(name, value, time) {
    var exTime = new Date();
    var time = time || 1;
    exTime.setDate(exTime.getDate() + time);
    document.cookie = name + '=' + escape(value) + ((time == null) ? '' : '; expires=' + exTime.toGMTString());
}

/**getCookie 获取缓存 */
function getCookie(id) {
    var startPosition = document.cookie.indexOf(id);
    if (document.cookie.indexOf(id) >= 0) {
        startPosition = startPosition + id.length + 1;
        var endPosition = document.cookie.indexOf(';', startPosition);
        if (endPosition === -1) {
            endPosition = document.cookie.length;
        }
        return unescape(document.cookie.slice(startPosition, endPosition));
    }
    return '';

}


var composite = new Interface('composite', ['add', 'remove', 'getChild']);
var formItem = new Interface('formItem', ['save', 'restore']);

/**
 * 组合对象类
 * @param {*string} id 实例元素ID 
 * @param {*string} method 提交类型
 * @param {*string} action 提交URL
 */
var CompositeForm = function (id, method, action) {
    this.formComponent = [];
    this.element = document.createElement('form');

    this.element.method = method || 'POST';
    this.element.action = action || '#';

    document.getElementById(id).appendChild(this.element);
}

CompositeForm.prototype.add = function (child) {
    ensureImplement(child, composite, formItem);
    this.formComponent.push(child);
    this.element.appendChild(child.getElement());
    console.log(this.formComponent);
}

CompositeForm.prototype.remove = function (child) {
    for (var i = 0; i < this.formComponent.length; i++) {
        var element = this.formComponent[i];
        if (this.formComponent[i] === child) {
            this.formComponent.splice(i, 1);
            break;
        }
    }
}

CompositeForm.prototype.save = function () {
    for (var i = 0; i < this.formComponent.length; i++) {
        var element = this.formComponent[i];
        element.save();
    }
}

CompositeForm.prototype.getChild = function (i) {
    return this.formComponent[i];
}

CompositeForm.prototype.restore = function () {
    for (var i = 0; i < this.formComponent.length; i++) {
        var component = this.formComponent[i];
        component.restore();
    }
}

/**
 * 页对象
 * @param {*string} id 页对象ID
 */
var Field = function (id) {
    this.id = id;
    this.element;
}

Field.prototype.add = function () {

}

Field.prototype.remove = function () {

}

Field.prototype.getChild = function () {

}

Field.prototype.save = function () {
    setCookie(this.id, this.getValue());
}

Field.prototype.getElement = function () {
    return this.element;
}


Field.prototype.getValue = function () {
    throw new Error('重定义各项取值器');
}

/**继承Feild类的input */
var InputField = function (id, label) {
    Field.call(this, id);

    this.input = document.createElement('input');
    this.input.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    this.element = document.createElement('div');
    this.element.className = 'input-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.input);
}

extend(InputField, Field);

InputField.prototype.getValue = function () {
    return this.input.value;
}

InputField.prototype.restore = function () {
    this.input.value = getCookie(this.id);
}

/**继承Feild类的textArea */
var TextareaField = function (id, label) {
    Field.call(this, id);

    this.textarea = document.createElement('textarea');
    this.textarea.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    this.element = document.createElement('div');
    this.element.className = 'input-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.textarea);
}

extend(TextareaField, Field);

TextareaField.prototype.getValue = function () {
    return this.textarea.value;
}


/**
 * 继承Feild类的Select
 * @param {*} id 
 * @param {*} label 
 */
var SelectField = function (id, label, options) {
    Field.call(this, id);

    this.select = document.createElement('select');
    this.select.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    for (var i = 0; i < options.length; i++) {
        var element = options[i];
        if (typeof element !== 'string') {
            throw new Error('必须是字符串')
        }
        var option = document.createElement('option');
        option.innerHTML = element;
        option.value = element;
        this.select.appendChild(option);
    }

    this.element = document.createElement('div');
    this.element.className = 'input-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.select);
}

extend(SelectField, Field);

SelectField.prototype.getValue = function () {
    return this.select.options[this.select.selectedIndex].value;
}

SelectField.prototype.restore = function () {
    for (var i = 0; i < this.select.options.length; i++) {
        var el = this.select.options[i];
        if (el.value === getCookie(this.id)) {
            el.selected = true;
        }
    }
}

/**域类 */
var CompositeFeildset = function (id, legendText) {
    this.components = {};

    this.element = document.createElement('fieldset');
    this.element.id = id;

    if (legendText) {
        this.legend = document.createElement('legend');
        this.legend.appendChild(document.createTextNode(legendText));
        this.element.appendChild(this.legend);
    }
}

CompositeFeildset.prototype.add = function (child) {
    ensureImplement(child, composite, formItem);
    this.components[child.id] = child;
    this.element.appendChild(child.getElement());
}

CompositeFeildset.prototype.remove = function (child) {
    delete this.components[child.id];
}

CompositeFeildset.prototype.save = function () {
    for (var key in this.components) {
        if (this.components.hasOwnProperty(key)) {
            var el = this.components[key];
            el.save();
        }
    }
}

CompositeFeildset.prototype.getChild = function (id) {
    if (this.components[id] != null) {
        return this.components[id];
    } else {
        return null;
    }
}

CompositeFeildset.prototype.restore = function () {
    for (var key in this.components) {
        if (this.components.hasOwnProperty(key)) {
            var el = this.components[key];
            el.restore();
        }
    }
}

CompositeFeildset.prototype.getElement = function () {
    return this.element;
}

var contactForm = new CompositeForm('div1', 'GET', '#');
var nameField = new CompositeFeildset('name-field', 'Name Info.');
var cityField = new CompositeFeildset('city-field', 'City');
var input1 = new InputField('email', 'Email: ');
var select1 = new SelectField('city', 'City: ', ['China', 'America', 'Russia']);
nameField.add(input1);
cityField.add(select1);

addEvent(window, 'unload', function () {
    contactForm.save();
});
addEvent(window, 'load', function () {
    contactForm.restore();
});

contactForm.add(nameField);
contactForm.add(cityField);

addEvent(document.getElementById('save-btn'), 'click', function () {
    contactForm.save();
});
addEvent(document.getElementById('restore-btn'), 'click', function () {
    contactForm.restore();
});