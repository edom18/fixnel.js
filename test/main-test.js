(function (win, doc) {

    'use strict';

    var dot = document.querySelector('#inner');
    var p = new Fixnel(dot);

    //-1730 -1596 
    var t = 0,
        b = -173,
        f = -159,
        c = f -b,
        d = 30;

    var bounce = new Easing('easeOutQuart', t, b, c, d);
    var test = document.querySelector('.test');
    var style = test.style;
    style.position = 'absolute';
    style.top = 0;
    style.left = '300px';
    style.zIndex = 10;

//    (function easing() {

//        var res = bounce.getValue();

//        if (res === null) {
//            return;
//        }
//        style.top = res + 'px';
//        setTimeout(easing, 1000 / 60);
//    }());
}(this, document));
