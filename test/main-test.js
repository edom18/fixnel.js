(function (win, doc) {

    'use strict';

    var dot = document.querySelector('#inner');
    var p = new Fixnel(dot);

    var t = 0,
        b = 0,
        c = 500,
        d = 30;

    var bounce = new Bounce('easeOutQuad', t, b, c, d);
    var test = document.querySelector('.test');
    var style = test.style;
    style.position = 'absolute';
    style.top = 0;
    style.left = '300px';
    style.zIndex = 10;

    (function easing() {

        var res = bounce.getValue();

        if (res === null) {
            return;
        }
        style.top = res + 'px';
        setTimeout(easing, 1000 / 60);
    }());
}(this, document));
