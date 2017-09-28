var Tooltip = function (element, text) {
    this.element = element;
    this.text = text;
    this.timer = null;
    this.dom = document.createElement('div');
    this.dom.style.position = 'absolute';
    this.dom.style.display = 'none';
    this.dom.innerHTML = this.text;
    document.getElementsByTagName('body')[0].appendChild(this.dom);

    var self = this;
    addEvent(this.element, 'mouseover', function (e) {
        self.startTimer(e);
    });
    addEvent(this.element, 'mouseout', function (e) {
        self.hide(e);
    });
}

Tooltip.prototype = {
    startTimer: function (e) {
        var self = this;
        var x = e.clientX;
        var y = e.clientY;
        if (this.timer == null) {
            this.timer = setTimeout(function () {
                self.show(x, y);
            }, 1500);
        }
    },
    show: function (x, y) {
        clearTimeout(this.timer);
        this.timer = null;
        this.dom.style.left = x + 'px';
        this.dom.style.top = (y + 20) + 'px';
        this.dom.style.display = 'block';

    },
    hide: function (e) {
        clearTimeout(this.timer);
        this.timer = null;
        this.dom.style.display = 'none';
    }
};


var box = new Tooltip($('box'), 'this is a box.');