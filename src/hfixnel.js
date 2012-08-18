/*
 * fixnel.js - This script give fix panel and scrolling.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.2.0
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
        timingFunction,

        /*! ------------------------------------------------------
            IMPORT
        ---------------------------------------------------------- */
        abs = Math.abs,
        pow = Math.pow,
        sqrt = Math.sqrt,
        sin = Math.sin,
        cos = Math.cos,
        PI = Math.PI;


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
            return c * pow (t/d, 3) + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c * (pow (t / d - 1, 3) + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2 * pow (t, 3) + b;
            }
            return c/2 * (pow (t-2, 3) + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c * pow (t/d, 4) + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * (pow (t/d-1, 4) - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2 * pow (t, 4) + b;
            }
            return -c/2 * (pow (t-2, 4) - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c * pow (t / d, 5) + b; },
        easeOutQuint: function (t, b, c, d) {
            return c * (pow (t / d-1, 5) + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * pow (t, 5) + b;
            }
            return c / 2 * (pow (t - 2, 5) + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return c * (1 - cos(t / d * (PI / 2))) + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * sin(t / d * (PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return c / 2 * (1 - cos(PI * t / d)) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return c * pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return c * (-pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c / 2 * pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return c * (1 - sqrt(1 - (t /= d) * t)) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * (1 - sqrt(1 - t * t)) + b;
            }
            return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b;
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
     * @class Fader
     * Manage the fade in/out and function.
     * @param {HScrollbarObject} scbar
     */
    function Fader() {
        this.init.apply(this, arguments);
    }
    Fader.mode = {
        NOT_FADE: 0, 
        FADE_OUT: 1, 
        FADE_IN : 2, 
        WAIT    : 3 
    };
    Fader.DEFAULT_DURATION = 30;
    Fader.DEFAULT_EASING = 'easeOutQuad';
    Fader.DEFAULT_DELAY = 500;
    Fader.FPS = 32;
    Fader.prototype = {
        Easing: Easing,
        init: function (scbar) {
        
            this.scbar     = scbar;
            this.target    = scbar.getEl();
            this.fadeState = Fader.mode.NOT_FADE;
        },
        fadeIn: function () {
        
            var b = 0,
                f = 1;

            this._clearTimer();
            if (this.fadeState === Fader.mode.FADE_IN) {
                return false;
            }
            if (this._fadeCheck(f)) {
                return false;
            }

            this._startFadeIn();
            this._fade(b, f);
        },
        fadeOut: function () {
        
            var b = 1,
                f = 0;

            this._clearTimer();
            if (this.fadeState === Fader.mode.FADE_OUT) {
                return false;
            }
            if (this._fadeCheck(f)) {
                return false;
            }

            this._startFadeOut();
            this._fade(b, f);
        },
        _fadeCheck: function (val) {
        
            return (+this._getOpacity() === val);
        },
        _clearTimer: function () {
            clearTimeout(this.waitTimer);
            clearTimeout(this.fadeTimer);
        },
        _startFadeIn: function () {
            this.fadeState = Fader.mode.FADE_IN;
        },
        _startFadeOut: function () {
            this.fadeState = Fader.mode.FADE_OUT;
        },
        _fade: function (b, f, d) {
        
            var self = this,
                t  = 0,
                _b = b,
                _f = f,
                c  = 0,
                _d = d || Fader.DEFAULT_DURATION,

                //shortcut
                easing = this.easing,
                style = this.target.style,
                FPS = Fader.FPS;

            if (easing) {
                _b = easing.getValue() || b;
            }
            c = _f - _b;

            this.easing = easing = new this.Easing(Fader.DEFAULT_EASING, t, _b, c, _d);

            clearTimeout(this.fadeTimer);
            (function ease() {

                var val = easing.getValue();

                if (val === null) {
                    console.log(f);
                    self.easing = null;
                    clearTimeout(self.fadeTimer);
                    self.fadeTimer = null;
                    self._setOpacity(f);
                    self._fadeEnd();
                    return false;
                }

                self._setOpacity(val);
                self.fadeTimer = setTimeout(ease, FPS);
            }());
        },
        _fadeEnd: function () {
            this.fadeState = Fader.mode.NOT_FADE;
        },
        delayFadeOut: function (ms) {
        
            var self = this;

            ms || (ms = Fader.DEFAULT_DELAY);

            clearTimeout(this.waitTimer);
            this.waitTimer = setTimeout(function () {
            
                self.waitTimer = null;
                if (self._getOpacity() === 0) {
                    return false;
                }
                self.fadeOut();
            }, ms);
        },
        _getOpacity: function () {
            return this.target.style.opacity;
        },
        _setOpacity: function (val) {
            if (isNaN(val) && !val) {
                return false;
            }
            this.target.style.opacity = val;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @class HScrollbar
     * To create scroll bar.
     * @param {VFixnelObject} fl
     */
    function HScrollbar() {
        this.init.apply(this, arguments);
    }
    HScrollbar.prototype = copyClone({}, EventDispatcher.prototype, {
        FPS: 1000 / 60,
        DURATION: 30,
        Easing: Easing,
        init: function (fl) {
        
            this.fl = fl;

            this._createElement();
            this._getContentInfo();
            this._setInitSize();
            this._fader = new Fader(this);

            this.fl.on('update', this._update, this);
            this.fl.on('move', this._move, this);
            this.fl.on('movestart', this._moveStart, this);
            this.fl.on('moveend', this._moveEnd, this);

            this.render();
        },
        render: function () {
        
            var self = this;

            this.container.appendChild(this.el);
            this._renderShow();

            return this;
        },
        _renderShow: function () {
            this._show();
            this._wait(2000);
        },
        getEl: function () {
            return this.el;
        },
        _getContentInfo: function () {
        
            this.width          = +(this.el.style.height || '').replace('px', '');
            this.container      = this.fl.getContainer();
            this.contentWidth   = this.fl.getWidth();
            this.containerWidth = this.fl.getParentWidth();
            this.scrollWidth    = this.contentWidth - this.containerWidth;
            this.ratio          = this.containerWidth / this.contentWidth;
        },
        _setPos: function (pos) {
        
            if (!pos) {
                return false;
            }

            var _pos;

            this._pos = pos;
            _pos = -((pos * this.ratio) | 0);
            this.el.style.webkitTransform = 'translate3d(' + _pos + 'px, 0, 0)';
        },

        /**
         * Set size
         */
        _setSize: function (val) {
        
            if (!val) {
                return false;
            }
            if (val < this.width) {
                val = this.width;
            }

            this.inner.style.width = val + 'px';
        },
        _setInitSize: function() {
        
            var val = (this.containerWidth * this.ratio) | 0;
            if (!val) {
                return false;
            }
            if (val < this.width) {
                val = this.width;
            }

            this.size = val;
            this.el.style.width = val + 'px';
            this.inner.style.width = val + 'px';
        },

        /**
         * Set size as top
         */
        _setSizeStart: function (val) {
            val = ((this.containerWidth * this.ratio) | 0) - val / 2;
            this._setPosOriginStart();
            this._setPos(0);
            this._setSize(val);
        },

        /**
         * Set size as bottom
         */
        _setSizeEnd: function (val) {
            var delta = val + (this.scrollWidth);

            val = ((this.containerWidth * this.ratio) | 0) + delta / 2;
            this._setPosOriginEnd();
            this._setPos(-this.scrollWidth);
            this._setSize(val);
        },

        _setPosOriginStart: function () {
        
            this.inner.style.left = 0;
            this.inner.style.right = 'auto';
        },

        _setPosOriginEnd: function () {
        
            this.inner.style.left = 'auto';
            this.inner.style.right = 0;
        },

        /**
         * Move event handler.
         * @param {EventObject} e
         * @param {Object} data has position value.
         */
        _move: function (e, data) {

            var value = data.value;

            if (value > 0) {
                this._setSizeStart(value);
            }
            else if (value < -(this.scrollWidth)) {
                this._setSizeEnd(value);
            }
            else if (value === null) {
                this.trigger('moveend');
                return false;
            }
            else {
                this._setPos(value);
            }
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
        
            this._wait(300);
            this.moving = false;
        },
        _wait: function (delay) {
            this._fader.delayFadeOut(delay);
        },
        _hide: function () {
            this._fader.fadeOut();
        },
        _show: function () {
            this._fader.fadeIn();
        },

        /**
         * Create elements wapper and bar.
         */
        _createElement: function () {

            var el = document.createElement('span'),
                inner = document.createElement('span');

            el.className = 'fixnel-scrollbar';
            el.style.cssText = [
                'opacity: 0;',
                'position: absolute;',
                'bottom: 1px;',
                'left: 0;',
                'height: 6px;'
            ].join('');

            inner.className = 'fixnel-scrollbar-inner';
            inner.style.cssText = [
                'position: absolute;',
                'left: 0;',
                'top: 0;',
                'height: 100%;',
                'background-color: rgba(0, 0, 0, 0.5);',
                'border-color: rgba(255, 255, 255, 0.3);',
                'border-radius: 3px;'
            ].join('');

            el.appendChild(inner);

            this.el = el;
            this.inner = inner;
        },
        _update: function () {
        
            this._getContentInfo();
            this._setInitSize();
            this._setPos(this._pos);
            this._renderShow();
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

            var i = 0;
            if (this.t > this.d) {
                return null;
            }

            ret = this.timingFunction(this.t++, this.b, this.c, this.d);

            return ret;
        }
    };

    ////////////////////////////////////////////////////////////////////

    function HFixnel(el) {
        this.init.apply(this, arguments);
    }

    HFixnel.prototype = copyClone({}, EventDispatcher.prototype, {
        dragging: false,
        DURATION: 30,
        FPS: 1000 / 60,
        prevAccX: 0,
        prevX: 0,
        prevT: 0,
        accX: 0,
        vy: 0,
        x: 0,
        init: function (el) {
        
            var self = this,
                className = 'fixnel-body';

            this.el = el;
            this.parentEl = el.parentNode;
            this.Easing = Easing;
            this.el.originalWidth = this.getWidth();

            this._initSettings();
            this._checkWidth();

            this.scrollbar = new HScrollbar(this);

            el.className += (el.className) ? ' ' + className : className;
            el.addEventListener(event.START, _bind(this._down, this), false);
            el.addEventListener(event.START, _bind(this._stop, this), false);
            doc.addEventListener(event.END, _bind(this._up, this), false);
            doc.addEventListener(event.MOVE, _bind(this._move, this), false);

            win.addEventListener('resize', _bind(this.update, this), false);
        },

        moveTo: function (x, opt) {
        
            var self = this,
                bottom,
                easing,
                timer,
                t, b, f, c, d;

            opt || (opt = {});

            if (x !== 0 && !x) {
                return;
            }

            x *= -1;

            if (x > 0) {
                x = 0;
            }
            else if (x < (bottom = -this._getRight())) {
                x = bottom;
            }

            if (opt.animOff) {
                this._setX(x);
                return false;
            }

            t = 0;
            b = this._getX();
            c = x - b;
            d = 10;
            easing = new this.Easing('easeOutExpo', t, b, c, d);
            this._autoMoving = true;
            
            (function ease() {

                var val = easing.getValue();

                if (val === null) {
                    easing = null;
                    clearTimeout(timer);
                    self._setX(x);
                    self._autoMoving = false;
                    return null;
                }

                self._setX(val);

                timer = setTimeout(ease, 16);
            }());
        },

        /**
         * Get next value.
         * @returns {Number} next value
         */
        getValue: function () {
        
            var oldX,
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

                return ret | 0;
            }

            oldX = this._getX();

            if (abs(vy) <= 0) {
                if (oldX > 0) {
                    b = oldX | 0;
                    c = 0 - b;
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else if (oldX < (bottom = -this._getRight())) {
                    b = oldX | 0;
                    c = bottom - b;
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else {
                    this._stopScrolling();
                    return null;
                }
            }

            if (oldX + vy > 0) {
                this.vy = (vy > 10) ?  10 : vy;
            }
            if (oldX - vy < (bottom = -this._getRight())) {
                this.vy = (vy < -10) ?  -10 : vy;
            }

            ret = (oldX + this.getVX()) | 0;
            return ret;
        },

        /**
         * Do initial settings
         */
        _initSettings: function () {
        
            this.el.style.webkitTextSizeAdjust = 'none';
            this.el.style.textSizeAdjust = 'none';
        },

        /**
         * To check height of parent and element.
         */
        _checkWidth: function () {
        
            var parentWidth = this.getParentWidth();

            if (this.getOriginalWidth() < parentWidth) {
                this._setWidth(parentWidth);
            }
            else {
                this._setWidth('auto');
            }
        },

        /**
         * To check overflow when update elements.
         */
        _checkOverflow: function () {
            if (-this._getRight() > this._getX()) {
                this._setX(-(this.getWidth() - this.getParentWidth()));
            }
        },

        /**
         * Scrolling function.
         */
        _scrolling: function () {
        
            var self = this;

            self.moving = true;

            clearInterval(self.timer);
            self.timer = setInterval(function () {
            
                var value = self.getValue();
                
                if (value === null) {
                    self._stopScrolling();
                    return false;
                }

                self._setX(value);
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
            this.trigger('moveend');
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


        /*! -----------------------------------------------------------
            GETTER & SETTER
        --------------------------------------------------------------- */
        /**
         * Get bottom
         * @returns {Number} return the bottom number
         */
        _getRight: function () {
        
            return this.getWidth() - this.getParentWidth();
        },

        /**
         * Get velocity of x
         * @returns {Number} current velocity of x.
         */
        getVX: function () {
        
            var curVX = this.vy;

            this.vy = this.vy - (this.vy / 30) << 0;
            return curVX;
        },

        _setWidth: function (val) {

            if (!val) {
                return false;
            }
            else if (Object.prototype.toString.call(val) === '[object String]') {
                this.el.style.height = val;
                return;
            }

            this.el.style.height = val + 'px';
        },

        /**
         * Get x position
         * @returns {Number} current x position number
         */
        _getX: function () {
        
            /*
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(this.el).webkitTransform),
                x = matrix.e,
                x = matrix.f;
            */

            return this.x;
        },

        /**
         * Set x position
         * @param {Number} x set the number.
         */
        _setX: function (x) {
        
            this.x = x;
            this.el.style.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';

            this.trigger('move', {
                value: x,
                direction: 'x'
            });
        },

        /**
         * Get container
         * @returns {Element} A parent element.
         */
        getContainer: function () {
            return this.parentEl;
        },

        /**
         * Get width
         * @returns {Number} element's width
         */
        getWidth: function () {
            return this.el.clientWidth;
        },

        /**
         * Get original width
         * @returns {Number} element's original width
         */
        getOriginalWidth: function () {

            var oldWidth = this.getWidth(),
                curWidth;

            //temporary setting to `auto`.
            this.el.style.width = 'auto';

            if (this.el.originalWidth !== (curWidth = this.getWidth())) {
                this.el.originalWidth = curWidth;
            }

            return this.el.originalWidth;
        },

        /**
         * Get parent width
         * @returns {Number} return the parent element width.
         */
        getParentWidth: function () {
            return this.parentEl.clientWidth;
        },

        /*! -----------------------------------------------------------
            EVENTS
        --------------------------------------------------------------- */
        /**
         * Mouse down event handler
         * @param {EventObject} e
         */
        _down: function (e) {
        
            if (this._autoMoving) {
                return false;
            }

            if (!!this.bouncing) {
                if (this._getX() < 0) {
                    this._setX(-this._getRight());
                }
                else {
                    this._setX(0);
                }
                this._stopScrolling();
            }
            
            this.dragging = true;
            this.trigger('movestart');

            //this.prevX = e.pageX;
            this.prevX = (e.touches) ? e.touches[0].pageX : e.pageX;
            this.prevT = +new Date();
        },


        /**
         * Mouse move event handler
         * @param {EventObject} e
         */
        _move: function (e) {

            e.preventDefault();
            if (!this.dragging) {
                return true;
            }
            clearTimeout(this.stopTimer);

            var oldX = this._getX(),
                now = +new Date(),
                t = now - this.prevT,
                pageX = (e.touches) ? e.touches[0].pageX : e.pageX,
                dist = this.prevX - pageX,
                accX = dist / (t || (t = 1)),
                d = (accX - this.prevAccX) / t,
                nextPos = oldX - dist;

            //calculate Acceleration.
            this.accX += d * t;

            //calculate Velocity.
            this.vy = -this.accX * t;

            if (nextPos > 0 || nextPos < -this._getRight()) {
                nextPos = oldX - ((dist / 2) | 0);
            }

            //set position
            this._setX(nextPos);

            //set previous values.
            this.prevT    = now;
            this.prevX    = pageX;
            this.prevAccX = accX;
        },

        /**
         * Mouse up event handler
         * @param {EventObject} e
         */
        _up: function (e) {

            if (!this.dragging) {
                return true;
            }
            this.dragging = false;
            this._scrolling();
        },
        update: function (e) {

            this._checkWidth();
            this._checkOverflow();
            this.trigger('update');
        }
    });

    //////////////////////////////////////////////
    exports.HFixnel = HFixnel;

}(this, document, this));