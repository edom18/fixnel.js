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

    var fader = new Fader(new Dummy());

    var flg = false;
    test.addEventListener('click', function () {

        if (flg) {
            flg = !flg;
            fader.fadeIn();
        }
        else {
            flg = !flg;
            fader.fadeOut();
        }
    }, false);


}(this, document));
