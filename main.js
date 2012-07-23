
(function (win, doc, exports) {

    'use strict';

    var dot = document.querySelector('#inner'),
        isTouch = ('ontouchstart' in window),
        event = {
            START: isTouch ? 'touchstart' : 'mousedown',
            MOVE : isTouch ? 'touchmove'  : 'mousemove',
            END  : isTouch ? 'touchend'   : 'mouseup'
        };

    function _bind(target, context) {
    
        return function () {
            target.apply(context, arguments);
        };
    }

    /////////////////////////////////////////////

    function Scrollbar() {
    
        this.init.apply(this, arguments);
    }
    Scrollbar.prototype = {
        init: function () {
        
        }
    };

    function Bounce(type) {
    
        this.init.apply(this, arguments);
    }
    Bounce.prototype = {
        init: function (type, t, b, c, d) {
        
            this.type = type || 'easeIn';
            this.t = t;
            this.b = b;
            this.c = c;
            this.d = d;
        },
        /**
         * Get next value
         * @returns {Number}
         */
        getValue: function () {
        
            var ret;

            if (this.t > this.d) {
                return null;
            }

            ret = this[this.type](this.t++, this.b, this.c, this.d);

            if (ret > this.c / 2) {
                ret = this.c - ret;
            }

            return ret;
        },
        /**
         * Quadratic Easing
         * @param {Number} t Time.
         * @param {Number} b Beginning position.
         * @param {Number} c Total change
         * @param {Number} d Duration
         */
        easeOutQuad: function (t, b, c, d) {

            return -c * (t /= d) * (t - 2) + b;
        }
    };

    ////////////////////////////////////////////////////////////////////

    function Fixnel(el) {
    
        this.init.apply(this, arguments);
    }

    Fixnel.prototype = {
        dragging: false,
        FPS: 1000 / 60,
        prevAccX: 0, prevAccY: 0,
        prevX: 0, prevY: 0,
        prevT: 0,
        accY: 0, accX: 0,
        vx: 0, vy: 0,
        K: 2,
        init: function (el) {
        
            this.el = el;
            this.parentEl = el.parentNode;

            el.addEventListener(event.START, _bind(this.mousedown, this), false);
            doc.addEventListener(event.END, _bind(this.mouseup, this), false);
            doc.addEventListener(event.MOVE, _bind(this.mousemove, this), false);

            el.addEventListener(event.START, _bind(this.stopScroll, this), false);
        },

        isDragging: function () {
        
            return this.dragging;
        },
        stopScroll: function (e) {
        
            var self = this;

            this.stopTimer = setTimeout(function () {

                clearInterval(self.timer);
                self.timer = null;
            }, 100);
        },
        _scrolling: function () {
        
            var self = this;

            this.dragging = false;
            this.moving = true;

            this.timer = setInterval(function () {
            
                var oldY = self.getY();

                if (Math.abs(self.vy) <= 0) {
                    self._stopScrolling();
                    return true;
                }
                if (oldY > 0) {
                    self._stopScrolling();
                    self._startBounce();
                    return true;
                }
                if (oldY < -(self._getBottom())) {
                    self._stopScrolling();
                    self._boundUp();
                    return true;
                }

                self.setY(oldY + self.getVY());
            }, this.FPS);
        },
        mousemove: function (e) {

            clearTimeout(this.stopTimer);
            if (!this.isDragging()) {
                return true;
            }

            var oldY = this.getY(),
                now = +new Date(),
                t = now - this.prevT,
                dist = this.prevY - e.pageY,
                accY = dist / (t || (t = 1)),
                d = (accY - this.prevAccY) / t;

            //calculate Acceleration.
            this.accY += d * t;

            //calculate Velocity.
            this.vy = -this.accY * t;

            this.prevT = now;
            this.setY((oldY -= dist));
            this.prevY = e.pageY;
            this.prevAccY = accY;
        },
        mouseup: function (e) {
        
            this._scrolling();
        },
        mousedown: function (e) {
        
            e.preventDefault();

            this.dragging = true;
            this.prevX = e.pageX;
            this.prevY = e.pageY;
            this.prevT = +new Date();
        },

        /**
         * Start bounc
         * @param {Number} v Verlocity
         */
        _startBounce: function (v) {
        
        },

        /**
         * Stop scrolling.
         */
        _stopScrolling: function () {
        
            //this.vy = 0;
            clearInterval(this.timer);
            this.moving = false;
        },

        _getParentHeight: function () {
        
            return this.parentEl.clientHeight;
        },

        _getHeight: function () {
        
            return this.el.clientHeight;
        },

        _getBottom: function () {
        
            return this._getHeight() - this._getParentHeight();
        },

        getVY: function () {
        
            var curVY = this.vy;

            this.vy = this.vy - (this.vy / 40) << 0;

            return curVY;
        },

        getY: function () {
        
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(this.el).webkitTransform),
                x = matrix.e,
                y = matrix.f;

            return y;
        },
        setY: function (y) {
        
            this.el.style.webkitTransform = 'translateY(' + y + 'px)';
        }
    };

    //////////////////////////////////////////////

    exports.Fixnel = Fixnel;
    exports.Bounce = Bounce;




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
        
}(this, document, this));
