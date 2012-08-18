(function (win, doc) {

    'use strict';

    var f1 = document.querySelector('#f1');
    var p = new Fixnel(f1, {
        direction: 'both'
    });

    window.p = p;
}(this, document));
