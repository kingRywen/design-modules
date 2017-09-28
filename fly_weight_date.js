/**CalendarItem interface */
var CalendarItem = new Interface('CalendarItem', ['display']);

/**享元单元 */
var CalendarDay = function () {
    
}

CalendarDay.prototype = {
    display: function (day, element) {
        var el = document.createElement('div');
        el.innerHTML = day + 1;
        element.appendChild(el);
    }
}

var calendarDay = new CalendarDay();

/**CalendarYear class */
var CalendarYear = function (year, parent) {
    this.year = year;
    this.parent = $(parent);
    this.element = document.createElement('div');
    this.element.style.display = 'none';
    this.parent.appendChild(this.element);

    function isLeapYear(year) {
        return year > 0 && !(year % 4) && (year % 100 || !(year % 400))
    }

    this.mouths = [];

    this.numDays = [31, isLeapYear(this.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (var i = 0; i < 12; i++) {
        this.mouths[i] = new CalendarMouth(i, this.numDays[i], this.element);
    }
}

CalendarYear.prototype = {
    display: function () {
        for (var i = 0; i < this.mouths.length; i++) {
            this.mouths[i].display();
        }
        this.element.style.display = 'block';
    }
}

var CalendarMouth = function (mouthNum, numDays, parent) {
    this.mouthNum = mouthNum;
    this.element = document.createElement('div');
    this.element.style.display = 'none';
    parent.appendChild(this.element);

    this.days = [];
    for (var i = 0; i < numDays; i++) {
        this.days[i] = calendarDay;

    }
}

CalendarMouth.prototype = {
    display: function () {
        this.element.style.display = 'block';
        for (var i = 0; i < this.days.length; i++) {
            this.days[i].display(i,this.element);
        }
    }
}


var year = new CalendarYear(2000, 'date');

year.display()