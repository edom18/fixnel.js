(function (win, doc) {

    'use strict';

    var f1 = document.querySelector('#f1');
    var p = new Fixnel(f1);
    var test = document.querySelector('.faderTest');

    function Dummy() {
        this.getEl = function () {
            return test;
        };
    }
}(this, document));
