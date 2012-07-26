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
        timingFunction;

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
    timingFunction = {
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


    function EventDispatcher() {}
    EventDispatcher.prototype = (function() {
        /**
         *  @param {string}   typ
         *  @param {?Object=} opt_evt
         *  @return {void}
         */
        function dispatchEvent(typ, opt_evt) {

            if (!typ) {
                throw "INVALID EVENT TYPE " + typ;
            }
            
            var obj = this.handlers || (this.handlers = {}),
                arr = [].concat(obj[typ] || []), //Use copy
                evt = opt_evt || {},
                len, i, fnc;
                
            evt.type || (evt.type = typ);
            
            // handle specified event type
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
            }
            
            // handle wildcard "*" event
            arr  = obj['*'] || [];
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
            }
        }

        /**
         *  @param {string} typ
         *  @param {function(evt:Object):void} fnc
         *  @param {Object} [context] if would like to be called context is set this param.
         *  @return {void}
         */
        function addEventListener(typ, fnc, context) {

            if (!typ) {
                throw "addEventListener:INVALID EVENT TYPE " + typ + " " + fnc;
            }
            
            var obj = this.handlers || (this.handlers = {});
            
            (obj[typ] || (obj[typ] = [])).push([fnc, context]);
        }
        /**
         *  @param {string} typ
         *  @param {function(evt:object):void} fnc
         */
        function removeEventListener(typ, fnc) {
            if (!typ) {
                throw "removeEventListener:INVALID EVENT TYPE " + typ + " " + fn;
            }
            
            var obj = this.handlers || (this.handlers = {}),
                arr = obj[typ] || [],
                i = arr.length;
                
            while(i) {
                arr[--i][0] === fnc && arr.splice(i, 1);
            }
        }

        function one(typ, fnc, context) {
        
            var self = this;

            function _fnc() {

                self.removeEventListener(typ, _fnc, context);
                fnc.apply(context || self, arguments);
            }

            this.addEventListener(typ, _fnc, context);
        }

        /* --------------------------------------------------------------------
            EXPORT
        ----------------------------------------------------------------------- */
        return {
            dispatchEvent       : dispatchEvent,
            trigger             : dispatchEvent,
            pub                 : dispatchEvent,
            
            addEventListener    : addEventListener,
            bind                : addEventListener,
            sub                 : addEventListener,
            on                  : addEventListener,
            
            removeEventListener : removeEventListener,
            unbind              : removeEventListener,
            off                 : removeEventListener,

            one                 : one
        };
    }());

    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * copy arguments object properties to `obj`
     * @param {Object} obj base to be copy of properties.
     */
    function copyClone(obj) {

        var args = Array.prototype.slice.call(arguments, 1),
            l    = args.length,
            i    = 0,
            src, prop;

        for (; i < l; i++) {
            src = args[i];
            for (prop in src) {
                obj[prop] = args[i][prop];
            }
        }

        return obj;
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @class Scrollbar
     * To create scroll bar.
     * @param {FixnelObject} fl
     */
    function Scrollbar() {
        this.init.apply(this, arguments);
    }
    Scrollbar.prototype = copyClone({}, EventDispatcher.prototype, {
        FPS: 1000 / 60,
        DURATION: 30,
        Easing: Easing,
        init: function (fl) {
        
            this.fl = fl;
            //this.flWidth = fl.getWidth();
            this.container = fl.getContainer();
            this.contentHeight = fl.getHeight();
            this.containerHeight = fl.getParentHeight();
            this.ratio = this.containerHeight / this.contentHeight;
            this.size = (this.containerHeight * this.ratio) | 0;
            this.el = this._createElement();

            this.fl.on('update', this._update, this);
            this.fl.on('move', this._move, this);
            this.fl.on('movestart', this._moveStart, this);

            this.on('moveend', this._moveEnd, this);

            this.render();
        },
        render: function () {
        
            var self = this;

            this.container.appendChild(this.el);
            this._show();
            this._wait(2000);

            return this;
        },
        getEl: function () {
        
            return this.el;
        },
        _setY: function (y) {
        
            var _y = -(y * this.ratio);
            this.el.style.webkitTransform = 'translate3d(0, ' + _y + 'px, 0)';
        },
        _move: function (e, data) {

            var value = data.value;

            if (value === null) {
                this.trigger('moveend');
                return false;
            }
            this._setY(value);
        },
        _moveStart: function () {
        
            clearTimeout(this.timer);
            if (this.moving || this.timer) {
                return false;
            }
            this.timer = null;
            this.moving = true;
            this._show();
        },
        _moveEnd: function () {
        
            this._wait(1000);
            this.moving = false;
        },
        _wait: function (delay) {
        
            var self = this;

            delay || (delay = 500);

            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
            
                clearTimeout(self.timer);
                self.timer = null;
                if (!self.moving) {
                    self._hide();
                }
            }, delay);
        },
        _fade: function (b, f) {
        
            var self = this,
                t = 0,
                _b = b,
                _f = f,
                c = 0,
                d = this.DURATION,
                easing = this.easing,
                style = this.getEl().style;

            if (easing) {
                _b = easing.getValue() || b;
            }
            c = _f - _b;

            this.easing = easing = new this.Easing('easeOutQuad', t, b, c, d);

            clearInterval(this.fadeTimer);
            (function ease() {

                var val = easing.getValue();

                if (val === null) {
                    self.easing = null;
                    clearTimeout(self.fadeTimer);
                    self.fadeTimer = null;
                    style.opacity = f;
                    return false;
                }

                style.opacity = val;
                self.fadeTimer = setTimeout(ease, self.FPS);
            }());
        },
        _hide: function () {
        
            var b = 1,
                f = 0;

            this._fade(b, f);
        },
        _show: function () {
        
            var b = 0,
                f = 1;

            this._fade(b, f);
        },
        _createElement: function () {

            var el = document.createElement('span'),
                style = el.style;

            el.className = 'fixnel-scrollbar';
            style.cssText = [
                'opacity: 0;',
                'position: absolute;',
                'right: 1px;',
                'top: 0;',
                'width: 6px;',
                'height: ' + this.size + 'px;',
                'background-color: rgba(0, 0, 0, 0.5);',
                'border-color: rgba(255, 255, 255, 0.3);',
                'border-radius: 3px;'
            ].join('');

            return el;
        },
        _update: function () {
        
            console.log('update');
        }
    });

    function Easing(type) {
        this.init.apply(this, arguments);
    }
    Easing.prototype = {
        init: function (type, t, b, c, d) {
        
            this.timingFunction = this.easing[(type || 'easeInQuad')];
            this.t = t;
            this.b = b;
            this.c = c;
            this.d = d;
        },
        easing: timingFunction,

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

    Fixnel.prototype = copyClone({}, EventDispatcher.prototype, {
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
        
            var className = 'fixnel-body';

            this.el = el;
            this.parentEl = el.parentNode;
            this.Easing = Easing;
            this.scrollbar = new Scrollbar(this);

            el.className += (el.className) ? ' ' + className : className;
            el.addEventListener(event.START, _bind(this._down, this), false);
            el.addEventListener(event.START, _bind(this._stop, this), false);
            doc.addEventListener(event.END, _bind(this._up, this), false);
            doc.addEventListener(event.MOVE, _bind(this._move, this), false);
        },

        /**
         * To is dragging
         * @return {Boolean} return true if panel is dragging.
         */
        isDragging: function () {
            return this.dragging;
        },

        /**
         * To check moving
         * @returns {Boolean} return true if panel is moving.
         */
        isMoving: function () {
            return this.moving;
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
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else if (oldY < (bottom = -this._getBottom())) {
                    b = oldY;
                    c = bottom - b;
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
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

            self.moving = true;

            clearInterval(self.timer);
            self.timer = setInterval(function () {
            
                var value = self.getValue();
                
                self.trigger('move', {
                    value: value,
                    direction: 'y'
                });
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
         * Event handler
         */
        _stop: function (e) {
        
            var self = this;

            this.stopTimer = setTimeout(function () {

                clearInterval(self.timer);
                self.timer = null;
            }, 100);
        },

        /**
         * Mouse down event handler
         * @param {EventObject} e
         */
        _down: function (e) {
        
            e.preventDefault();
            this.dragging = true;
            this.trigger('movestart');

            //this.prevX = e.pageX;
            this.prevY = e.pageY;
            this.prevT = +new Date();
        },


        /**
         * Mouse move event handler
         * @param {EventObject} e
         */
        _move: function (e) {

            if (!this.isDragging()) {
                return true;
            }
            clearTimeout(this.stopTimer);

            var oldY = this.getY(),
                now = +new Date(),
                t = now - this.prevT,
                pageY = e.pageY,
                dist = this.prevY - pageY,
                accY = dist / (t || (t = 1)),
                d = (accY - this.prevAccY) / t;

            //calculate Acceleration.
            this.accY += d * t;

            //calculate Velocity.
            this.vy = -this.accY * t;

            //set position
            this.setY((oldY -= dist));

            this.trigger('move', {
                value: oldY,
                direction: 'y'
            });

            //set previous values.
            this.prevT    = now;
            this.prevY    = pageY;
            this.prevAccY = accY;
        },

        /**
         * Mouse up event handler
         * @param {EventObject} e
         */
        _up: function (e) {

            this.dragging = false;
            this._scrolling();
        },

        /**
         * Get parent height
         * @returns {Number} parent element's height
         */
        _getParentHeight: function () {
            return this.parentEl.clientHeight;
        },

        /**
         * Get bottom
         * @returns {Number} return the bottom number
         */
        _getBottom: function () {
        
            return this.getHeight() - this._getParentHeight();
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
        },

        /**
         * Get container
         * @returns {Element} A parent element.
         */
        getContainer: function () {
        
            return this.parentEl;
        },

        /**
         * Get height
         * @returns {Number} element's height
         */
        getHeight: function () {
        
            return this.el.clientHeight;
        },

        /**
         * Get parent height
         * @returns {Number} return the parent element height.
         */
        getParentHeight: function () {
        
            return this.parentEl.clientHeight;
        }
    });

    //////////////////////////////////////////////

    exports.Fixnel = Fixnel;

    //for test.
    exports.Easing = Easing;
}(this, document, this));
