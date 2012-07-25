/*
 * fixnel.js - This script give fix panel and scrolling.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.1.0
 * @github   https://github.com/edom18/fixnel.js
 */
(function (win, doc, exports) {

    'use strict';

    var isTouch = ('ontouchstart' in window),
        event = {
            START: isTouch ? 'touchstart' : 'mousedown',
            MOVE : isTouch ? 'touchmove'  : 'mousemove',
            END  : isTouch ? 'touchend'   : 'mouseup'
        },
        Easing;

    /////////////////////////////////////////////

    function _bind(target, context) {
        return function () {
            target.apply(context, arguments);
        };
    }

    /////////////////////////////////////////////

    /**
     * Easing functions
     * @param {Number} t Time.
     * @param {Number} b Beginning position.
     * @param {Number} c Total change
     * @param {Number} d Duration
     * @example
     *  var begin    = 100,
     *      finish   = 220,
     *      change   = finish - begin,
     *      duration = 30,
     *      time     = 0;
     * (function easing() {
     *     var x = easeInCubic(time++, begin, change, duration);
     *
     *     if (time > duration) return;
     *     setTimeout(easing, 1000 / 60);
     * }());
     */
    Easing = {
        easeInCubic: function (t, b, c, d) {
            return c * Math.pow (t/d, 3) + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c * (Math.pow (t / d - 1, 3) + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2 * Math.pow (t, 3) + b;
            }
            return c/2 * (Math.pow (t-2, 3) + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c * Math.pow (t/d, 4) + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * (Math.pow (t/d-1, 4) - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2 * Math.pow (t, 4) + b;
            }
            return -c/2 * (Math.pow (t-2, 4) - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c * Math.pow (t / d, 5) + b; },
        easeOutQuint: function (t, b, c, d) {
            return c * (Math.pow (t / d-1, 5) + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow (t, 5) + b;
            }
            return c / 2 * (Math.pow (t - 2, 5) + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return c * (1 - Math.cos(t / d * (Math.PI / 2))) + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return c / 2 * (1 - Math.cos(Math.PI * t / d)) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * (1 - Math.sqrt(1 - t * t)) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInQuad: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c/2 * ((--t) * (t - 2) - 1) + b;
        }
    };

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
        
            this.timingFunction = this.easing[(type || 'easeInQuad')];
            this.t = t;
            this.b = b;
            this.c = c;
            this.d = d;
        },
        easing: Easing,

        /**
         * Get next value
         * @returns {Number}
         */
        getValue: function () {
        
            var ret;

            if (this.t > this.d) {
                return null;
            }

            ret = this.timingFunction(this.t++, this.b, this.c, this.d);

            return ret;
        }
    };

    ////////////////////////////////////////////////////////////////////

    function Fixnel(el) {
        this.init.apply(this, arguments);
    }

    Fixnel.prototype = {
        dragging: false,
        DURATION: 30,
        FPS: 1000 / 60,
        //prevAccX: 0,
        prevAccY: 0,
        //prevX: 0,
        prevY: 0,
        prevT: 0,
        //accX: 0,
        accY: 0,
        //vx: 0,
        vy: 0,
        init: function (el) {
        
            this.el = el;
            this.parentEl = el.parentNode;
            this.Bounce = Bounce;

            el.addEventListener(event.START, _bind(this.mousedown, this), false);
            el.addEventListener(event.START, _bind(this.stopScroll, this), false);
            doc.addEventListener(event.END, _bind(this.mouseup, this), false);
            doc.addEventListener(event.MOVE, _bind(this.mousemove, this), false);
        },

        /**
         * To is dragging
         * @return {Boolean} return true if panel is dragging.
         */
        isDragging: function () {
            return this.dragging;
        },

        /**
         * Event handler
         */
        stopScroll: function (e) {
        
            var self = this;

            this.stopTimer = setTimeout(function () {

                clearInterval(self.timer);
                self.timer = null;
            }, 100);
        },

        /**
         * Get next value.
         * @returns {Number} next value
         */
        getValue: function () {
        
            var oldY,
                bottom,
                t = 0,
                b = 0,
                c = 0,
                d = this.DURATION,
                vy = this.vy,
                ret = 0;

            if (this.bouncing) {
                ret = this.bounce.getValue();

                if (ret === null) {
                    this._stopScrolling();
                    return null;
                }

                return ret;
            }

            oldY = this.getY();

            if (Math.abs(vy) <= 0) {
                if (oldY > 0) {
                    b = oldY;
                    c = 0 - b;
                    this.bounce = new this.Bounce('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else if (oldY < (bottom = -this._getBottom())) {
                    b = oldY;
                    c = bottom - b;
                    this.bounce = new this.Bounce('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else {
                    this._stopScrolling();
                    return null;
                }
            }

            if (oldY + vy > 0) {
                this.vy = (vy > 10) ?  10 : vy;
            }
            if (oldY - vy < (bottom = -this._getBottom())) {
                this.vy = (vy < -10) ?  -10 : vy;
            }

            ret = oldY + this.getVY();
            return ret;
        },
        _scrolling: function () {
        
            var self = this;

            self.dragging = false;
            self.moving = true;

            self.timer = setInterval(function () {
            
                var value = self.getValue();
                
                if (value === null) {
                    self._stopScrolling();
                    return false;
                }

                self.setY(value);
            }, this.FPS);
        },

        /**
         * Stop scrolling.
         */
        _stopScrolling: function () {
        
            this.vy = 0;
            clearInterval(this.timer);
            this.moving = false;
            this.bouncing = false;
            this.bounce = null;
        },

        /**
         * Mouse move event handler
         * @param {EventObject} e
         */
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

        /**
         * Mouse up event handler
         * @param {EventObject} e
         */
        mouseup: function (e) {
            this._scrolling();
        },

        /**
         * Mouse down event handler
         * @param {EventObject} e
         */
        mousedown: function (e) {
        
            e.preventDefault();

            this.dragging = true;
            //this.prevX = e.pageX;
            this.prevY = e.pageY;
            this.prevT = +new Date();
        },

        /**
         * Get parent height
         * @returns {Number} parent element's height
         */
        _getParentHeight: function () {
            return this.parentEl.clientHeight;
        },

        /**
         * Get height
         * @returns {Number} element's height
         */
        _getHeight: function () {
        
            return this.el.clientHeight;
        },

        /**
         * Get bottom
         * @returns {Number} return the bottom number
         */
        _getBottom: function () {
        
            return this._getHeight() - this._getParentHeight();
        },

        /**
         * Get velocity of Y
         * @returns {Number} current velocity of y.
         */
        getVY: function () {
        
            var curVY = this.vy;

            this.vy = this.vy - (this.vy / 30) << 0;

            return curVY;
        },

        /**
         * Get Y position
         * @returns {Number} current y position number
         */
        getY: function () {
        
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(this.el).webkitTransform),
                //x = matrix.e,
                y = matrix.f;

            return y;
        },

        /**
         * Set y position
         * @param {Number} y set the number.
         */
        setY: function (y) {
        
            this.el.style.webkitTransform = 'translate3d(0, ' + y + 'px, 0)';
        }
    };

    //////////////////////////////////////////////

    exports.Fixnel = Fixnel;

    //for test.
    exports.Bounce = Bounce;
}(this, document, this));
