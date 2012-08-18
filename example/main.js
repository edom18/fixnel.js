(function (win, doc) {

    'use strict';

    var f1 = document.querySelector('#f1');
    var p1 = new Fixnel(f1);

    var f2 = document.querySelector('#f2');
    var p2 = new Fixnel(f2, {
        direction: Fixnel.directionType.HORIZONTAL
    });

    var f3 = document.querySelector('#f3');
    var p3 = new Fixnel(f3, {
        direction: Fixnel.directionType.BOTH
    });
}(this, document));
