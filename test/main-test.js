(function (win, doc) {

    'use strict';

    var f1 = document.querySelector('#f1');
    var p = new Fixnel(f1);
    var p2 = new HFixnel(f1);

    window.p = p;
}(this, document));
