// 类式继承

var InputField = function (id, text) {
  this.id = id;
  this.text = text;
  this.createField();
  this.edit();
  this.save();
  this.cancel();
};

var extend = function (subClass, superClass) {
  var F = function () {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
  subClass.superclass = superClass.prototype;

  if (superClass.prototype === Object.prototype) {
    superClass.prototype.constructor = superClass;
  }
};

function InputFieldTextArea(id, text) {
  InputFieldTextArea.superclass.constructor.call(this, id, text);
};

extend(InputFieldTextArea, InputField);

InputFieldTextArea.prototype.createField = function () {
  this.textSpan = document.createElement('span');
  this.textSpan.innerHTML = this.text;
  this.textWrapper = document.createElement('div');
  this.textWrapper.style.display = 'none';
  this.id.appendChild(this.textWrapper);
  this.id.appendChild(this.textSpan);
  this.Input = document.createElement('textarea');
  this.Input.type = 'text';
  this.saveBtn = document.createElement('input');
  this.saveBtn.type = 'button';
  this.saveBtn.value = 'save';
  this.cancelBtn = document.createElement('input');
  this.cancelBtn.type = 'button';
  this.cancelBtn.value = 'cancel';
  this.textWrapper.appendChild(this.Input);
  this.textWrapper.appendChild(this.saveBtn);
  this.textWrapper.appendChild(this.cancelBtn);
};

InputField.prototype.createField = function () {
  this.textSpan = document.createElement('span');
  this.textSpan.innerHTML = this.text;
  this.textWrapper = document.createElement('div');
  this.textWrapper.style.display = 'none';
  this.id.appendChild(this.textWrapper);
  this.id.appendChild(this.textSpan);
  this.Input = document.createElement('input');
  this.Input.type = 'text';
  this.saveBtn = document.createElement('input');
  this.saveBtn.type = 'button';
  this.saveBtn.value = 'save';
  this.cancelBtn = document.createElement('input');
  this.cancelBtn.type = 'button';
  this.cancelBtn.value = 'cancel';
  this.textWrapper.appendChild(this.Input);
  this.textWrapper.appendChild(this.saveBtn);
  this.textWrapper.appendChild(this.cancelBtn);
};

InputField.prototype.edit = function () {
  var self = this;
  this.textSpan.addEventListener('click', function () {
    self.textSpan.style.display = 'none';
    self.textWrapper.style.display = 'inline';
    self.textSpan.innerHTML = self.text;
    self.Input.value = self.text;
  });
};

InputField.prototype.save = function () {
  var self = this;
  this.saveBtn.addEventListener('click', function () {
    self.setText(self.Input.value);
    self.textSpan.innerHTML = self.text;
    self.convertHide();
  })
};

InputField.prototype.setText = function (text) {
  this.text = text;
  this.Input.value = text;
};

InputField.prototype.convertHide = function () {
  this.textWrapper.style.display = 'none';
  this.textSpan.style.display = 'inline';
};

InputField.prototype.cancel = function () {
  var self = this;
  this.cancelBtn.addEventListener('click', function () {
    self.convertHide();
  })
};




var oDiv = document.getElementById('div');
var oDiv1 = document.getElementById('div1');
var Div = new InputField(oDiv,'this is edit text.');

var Div2 = new InputFieldTextArea(oDiv1,'this is 2');