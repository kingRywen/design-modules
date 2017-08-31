// 原型式继承

var InputField = {
  configure: function (id, text) {
    this.id = id;
    this.text = text;
    this.createField();
    this.edit();
    this.save();
    this.cancel();
  },
  createField: function () {
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
  },
  edit: function () {
    var self = this;
    this.textSpan.addEventListener('click', function () {
      self.textSpan.style.display = 'none';
      self.textWrapper.style.display = 'inline';
      self.textSpan.innerHTML = self.text;
      self.Input.value = self.text;
    });
  },
  save: function () {
    var self = this;
    this.saveBtn.addEventListener('click', function () {
      self.setText(self.Input.value);
      self.textSpan.innerHTML = self.text;
      self.convertHide();
    })
  },
  setText: function (text) {
    this.text = text;
    this.Input.value = text;
  },
  convertHide: function () {
    this.textWrapper.style.display = 'none';
    this.textSpan.style.display = 'inline';
  },
  cancel: function () {
    var self = this;
    this.cancelBtn.addEventListener('click', function () {
      self.convertHide();
    })
  }
};

function clone(obj) {
  var F = function () {};
  F.prototype = obj;
  return new F;
}

var oDiv = document.getElementById('div');
var inputFieldA = clone(InputField);
inputFieldA.configure(oDiv,'this is.');