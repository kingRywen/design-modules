/**CalendarItem interface */
var CalendarItem = new Interface('CalendarItem', ['display']);

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
        this.days[i] = new CalendarDay(i, this.element);

    }
}

CalendarMouth.prototype = {
    display: function () {
        this.element.style.display = 'block';
        for (var i = 0; i < this.days.length; i++) {
            this.days[i].display();
        }
    }
}


var CalendarDay = function (day, parent) {
    this.day = day;
    this.element = document.createElement('div');
    this.element.innerHTML = this.day;
    this.element.style.display = 'none';
    parent.appendChild(this.element);
}

CalendarDay.prototype = {
    display: function () {
        this.element.style.display = 'block';
    }
}

var year = new CalendarYear(2000, 'date');

year.display()