/*
 * fixnel.js - This script give fix panel and scrolling.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.5.3
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
        abs  = Math.abs,
        pow  = Math.pow,
        sqrt = Math.sqrt,
        sin  = Math.sin,
        cos  = Math.cos,
        PI   = Math.PI;

    /////////////////////////////////////////////

    function abstractMethod() {
        throw new Error('MUST BE IMPLEMENTS THIS METHOD');
    }

    /////////////////////////////////////////////

    /**
     * @param {Function} target To be applied target.
     * @param {Function} context As context is called with target.
     * @return {Function} Binding function.
     */
    function _bind(target, context) {
        return function () {
            target.apply(context, arguments);
        };
    }

    /////////////////////////////////////////////

    /**
     * @param {Object} props To be extended properties.
     * @return {Function} Extended function.
     */
    function _extend(props) {
    
        var super_ = this,
            child = function () {
                super_.apply(this, arguments);
            };

        function ctor() {}

        ctor.prototype = super_.prototype;
        child.prototype = new ctor();
        child.prototype.callParent = function () {
            super_.apply(this, arguments);
        };
        child.prototype.super_ = super_.prototype;

        copyClone(child.prototype, props);

        return child;
    }

    //////////////////////////////////////////////////

    /**
     * copy arguments object properties to `obj`
     * @param {Object} obj base to be copy of properties.
     * @return {Obj}
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


    /////////////////////////////////////////////

    /**
     * Easing functions
     * @param {number} t Time.
     * @param {number} b Beginning position.
     * @param {number} c Total change
     * @param {number} d Duration
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


    /** @constructor */
    function EventDispatcher() {}
    EventDispatcher.prototype = (function() {
        /**
         *  @param {string}   typ
         *  @param {Object=} opt_evt
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

        /**
         * @param {string} typ
         * @param {Function} fnc
         * @param {Function} context
         */
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

    ////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Manage the fade in/out and function.
     * @constructor
     * @param {VScrollbarObject} scbar
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
    Fader.DEFAULT_DURATION = 10;
    Fader.DEFAULT_EASING = 'easeOutQuad';
    Fader.DEFAULT_DELAY = 400;
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
            if (this._fadeCheck(f)) {
                return false;
            }

            this._fade(b, f, 1);
        },
        fadeOut: function () {
        
            var b = 1,
                f = 0;

            this._clearTimer();
            if (this._fadeCheck(f)) {
                return false;
            }

            this._fade(b, f);
        },
        _fadeCheck: function (val) {
        
            return (+this._getOpacity() === val);
        },
        _clearTimer: function () {
            clearTimeout(this.waitTimer);
            clearTimeout(this.fadeTimer);
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
        
            if (!val) {
                return false;
            }
            this.target.style.opacity = val;
        }
    };
    Fader.prototype.constructor = Fader;

    ////////////////////////////////////////////////////////////////////////////////////////

    /** @constructor */
    function ScrollbarBase(fl) {
        this.init.apply(this, arguments);
    }
    ScrollbarBase.extend = _extend;

    ScrollbarBase.prototype = copyClone({}, EventDispatcher.prototype, {
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
        show: function () {
            this.inner.style.display = 'block';
        },
        hide: function () {
            this.inner.style.display = 'none';
        },
        _renderShow: function () {
            this._show();
            this._wait(2000);
        },
        getEl: function () {
            return this.el;
        },
        _getContentInfo: function () {
            this._minSize      = this._getMinSize();
            this.container     = this.fl.getContainer();
            this.contentSize   = this.fl.getSize();
            this.containerSize = this.fl.getParentSize();
            this.scrollSize    = this.contentSize - this.containerSize;
            this.ratio         = this.containerSize / this.contentSize;
        },
        _getMinSize: abstractMethod,
        _setPos: abstractMethod,

        /**
         * Set size
         */
        _setSize: abstractMethod,
        _setElSize: abstractMethod,
        _setInitSize: function() {
            var val = (this.containerSize * this.ratio) | 0;

            if (!val) {
                return false;
            }
            if (val < this._minSize) {
                val = this._minSize;
            }

            this.size = val;
            this._setSize(val);
            this._setElSize(val);
        },

        /**
         * Set size as top
         */
        _setSizeStart: function (val) {
            val = ((this.containerSize * this.ratio) | 0) - val / 2;
            this._setPosOriginStart();
            this._setPos(0);
            this._setSize(val);
        },

        /**
         * Set size as bottom
         */
        _setSizeEnd: function (val) {
            var delta = val + (this.scrollSize);

            val = ((this.containerSize * this.ratio) | 0) + delta / 2;
            this._setPosOriginEnd();
            this._setPos(-this.scrollSize);
            this._setSize(val);
        },

        _setPosOriginStart: abstractMethod,
        _setPosOriginEnd: abstractMethod,

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
            else if (value < -(this.scrollSize)) {
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

        /**
         * Move end.
         */
        _moveEnd: function () {
            this._wait(300);
            this.moving = false;
        },
        _wait: function (delay) {
            this._fader.delayFadeOut(delay);
        },

        /**
         * Hide scrollbar.
         */
        _hide: function () {
            this._fader.fadeOut();
        },

        /**
         * Show scrollbar.
         */
        _show: function () {
            this._fader.fadeIn();
        },

        /**
         * Create elements wapper and bar.
         */
        _createElement: abstractMethod,

        _update: function () {
            this._getContentInfo();
            this._setInitSize();
            this._setPos(this._pos);
            this._renderShow();
        }
    });

    ScrollbarBase.prototype.constructor = ScrollbarBase;

    ////////////////////////////////////////////////////////////////////////////////////////

    /**
     * To create scroll bar.
     * @constructor
     * @param {VFixnelObject} fl
     */
    var VScrollbar = ScrollbarBase.extend({
        _getMinSize: function () {
            return +(this.el.style.width || '').replace('px', '');
        },
        _setPos: function (pos) {
            if (!pos) {
                return false;
            }

            var _pos;

            this._pos = pos;
            _pos = -((pos * this.ratio) | 0);
            this.el.style.webkitTransform = 'translate3d(0, ' + _pos + 'px, 0)';
        },

        /**
         * Set size
         */
        _setSize: function (val) {
        
            if (!val) {
                return false;
            }
            if (val < this._minSize) {
                val = this._minSize;
            }

            this.inner.style.height = val + 'px';
        },
        _setElSize: function (val) {

            if (!val) {
                return false;
            }
            if (val < this._minSize) {
                val = this._minSize;
            }

            this.el.style.height = val + 'px';
        },

        _setPosOriginStart: function () {
            this.inner.style.top = 0;
            this.inner.style.bottom = 'auto';
        },

        _setPosOriginEnd: function () {
            this.inner.style.top = 'auto';
            this.inner.style.bottom = 0;
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
                'right: 1px;',
                'top: 0;',
                'width: 6px;'
            ].join('');

            inner.className = 'fixnel-scrollbar-inner';
            inner.style.cssText = [
                'position: absolute;',
                'left: 0;',
                'top: 0;',
                'width: 100%;',
                'background-color: rgba(0, 0, 0, 0.5);',
                'border-color: rgba(255, 255, 255, 0.3);',
                'border-radius: 3px;'
            ].join('');

            el.appendChild(inner);

            this.el = el;
            this.inner = inner;
        }
    });

    VScrollbar.prototype.constructor = VScrollbar;
    

    ////////////////////////////////////////////////////////////////////////////

    /**
     * To create scroll bar.
     * @constructor
     * @param {VFixnelObject} fl
     */
    var HScrollbar = ScrollbarBase.extend({
        _getMinSize: function () {
            return +(this.el.style.height || '').replace('px', '');
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
            if (val < this._minSize) {
                val = this._minSize;
            }

            this.inner.style.width = val + 'px';
        },
        _setElSize: function (val) {

            if (!val) {
                return false;
            }
            if (val < this._minSize) {
                val = this._minSize;
            }

            this.el.style.width = val + 'px';
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
        }
    });

    HScrollbar.prototype.constructor = HScrollbar;


    /**
     * @constructor
     * @param {string} type
     */
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
         * @returns {number}
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

    /**
     * @constructor
     * @param {Element} el
     * @param {Object} opt
     */
    function Fixnel(el, opt) {
        this.init.apply(this, arguments);
    }
    Fixnel.directionType = {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal',
        BOTH: 'both'
    };
    Fixnel.prototype = copyClone({}, EventDispatcher.prototype, {
        _setEvents: function () {
            if (this._vfixnel) {
                this._vfixnel.on('move', this._moveY, this);
                this._vfixnel.on('moveend', this._moveEndY, this);
            }
            if (this._hfixnel) {
                this._hfixnel.on('move', this._moveX, this);
                this._hfixnel.on('moveend', this._moveEndX, this);
            }
        },
        _moveX: function (e, data) {
            this.trigger('moveX', data);
        },
        _moveY: function (e, data) {
            this.trigger('moveY', data);
        },
        _moveEndX: function () {
            this.trigger('moveendx');
        },
        _moveEndY: function () {
            this.trigger('moveendy');
        },
        init: function (el, opt) {

            opt || (opt = {});

            if (opt.direction === Fixnel.directionType.BOTH) {
                this._vfixnel = new VFixnel(el);
                this._hfixnel = new HFixnel(el);
            }
            else if (opt.direction === Fixnel.directionType.HORIZONTAL) {
                this._hfixnel = new HFixnel(el);
            }
            else if (opt.direction === Fixnel.directionType.VERTICAL) {
                this._vfixnel = new VFixnel(el);
            }
            else {
                this._vfixnel = new VFixnel(el);
            }

            this._setEvents();
        },
        moveTo: function (x, y, opt) {
            if (this._vfixnel) {
                this._vfixnel.moveTo(y, opt);
            }
            if (this._hfixnel) {
                this._hfixnel.moveTo(x, opt);
            }
        },
        update: function () {
            if (this._vfixnel) {
                this._vfixnel.update();
            }
            if (this._hfixnel) {
                this._hfixnel.update();
            }
        }
    });
    Fixnel.prototype.constructor = Fixnel;

    ////////////////////////////////////////////////////////////////////

    /** @constructor */
    function FixnelBase(el) {
        this.init.apply(this, arguments);
    }
    FixnelBase.extend = _extend;

    FixnelBase.prototype = copyClone({}, EventDispatcher.prototype, {
        /** @type {boolean} */
        dragging: false,

        /** @type {number} */
        DURATION: 30,

        /** @type {number} */
        FPS: 1000 / 60,

        /** @type {number} */
        prevAcc: 0,

        /** @type {number} */
        prevPos: 0,

        /** @type {number} */
        prevT: 0,
        
        /** @type {number} */
        acc: 0,

        /** @type {number} */
        _v: 0,

        /** @type {number} */
        pos: 0,

        /**
         * Initialize Fixnel.
         * @param {Element} el
         */
        init: function (el) {
        
            var self = this,
                className = 'fixnel-body';

            this.el = el;
            this.parentEl = el.parentNode;
            this.Easing = Easing;
            this.el.originalSize = this.getSize();

            this.scrollbar = this._getScrollbar();
            this._initSettings();
            this._checkSize();
            this.update();

            el.className += (el.className) ? ' ' + className : className;
            el.addEventListener(event.START, _bind(this._down, this), false);
            el.addEventListener(event.START, _bind(this._stop, this), false);
            doc.addEventListener(event.END, _bind(this._up, this), false);
            doc.addEventListener(event.MOVE, _bind(this._move, this), false);

            win.addEventListener('resize', _bind(this.update, this), false);
        },

        moveTo: function (pos, opt) {
        
            var self = this,
                edge,
                easing,
                timer,
                t, b, f, c, d;

            opt || (opt = {});

            if (pos !== 0 && !pos) {
                return;
            }

            pos *= -1;

            if (pos > 0) {
                pos = 0;
            }
            else if (pos < (edge = -this._getEdge())) {
                pos = edge;
            }

            if (opt.animOff || opt.animate === false) {
                this._setPos(pos);
                return false;
            }

            t = 0;
            b = this._getPos();
            c = pos - b;
            d = 10;
            easing = new this.Easing('easeOutExpo', t, b, c, d);
            this._autoMoving = true;
            
            (function ease() {

                var val = easing.getValue();

                if (val === null) {
                    easing = null;
                    clearTimeout(timer);
                    self._setPos(pos);
                    self._autoMoving = false;
                    return null;
                }

                self._setPos(val);

                timer = setTimeout(ease, 16);
            }());
        },

        /**
         * Get next value.
         * @returns {number} next value
         */
        getValue: function () {
        
            var oldPos,
                edge,
                t = 0,
                b = 0,
                c = 0,
                d = this.DURATION,
                _v = this._v,
                ret = 0;

            if (this.bouncing) {
                ret = this.bounce.getValue();

                if (ret === null) {
                    return null;
                }

                return ret | 0;
            }

            oldPos = this._getPos();

            if (abs(_v) <= 0) {
                if (oldPos > 0) {
                    b = oldPos | 0;
                    c = 0 - b;
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else if (oldPos < (edge = -this._getEdge())) {
                    b = oldPos | 0;
                    c = edge - b;
                    this.bounce = new this.Easing('easeOutExpo', t, b, c, d);
                    this.bouncing = true;
                }
                else {
                    return null;
                }
            }

            if (oldPos + _v > 0) {
                this._v = (_v > 10) ?  10 : _v;
            }
            if (oldPos - _v < (edge = -this._getEdge())) {
                this._v = (_v < -10) ?  -10 : _v;
            }

            ret = (oldPos + this.getV()) | 0;
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
        _checkSize: function () {
        
            var parentSize = this.getParentSize();

            if (this.getOriginalSize() < parentSize) {
                this._setSize(parentSize);
                this.scrollbar.hide();
            }
            else {
                this._setSize('auto');
                this.scrollbar.show();
            }
        },

        /**
         * To check overflow when update elements.
         */
        _checkOverflow: function () {
            if (-this._getEdge() > this._getPos()) {
                this._setPos(-(this.getSize() - this.getParentSize()));
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

                self._setPos(value);
            }, this.FPS);
        },

        /**
         * Stop scrolling.
         */
        _stopScrolling: function () {
            this._v = 0;
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
        _getScrollbar: abstractMethod,

        /**
         * Get edge
         * @returns {number} return the edge number
         */
        _getEdge: function () {
            return this.getSize() - this.getParentSize();
        },

        /**
         * Get velocity of pos
         * @returns {number} current velocity of pos.
         */
        getV: function () {
        
            var curV = this._v;

            this._v = this._v - (this._v / 30) << 0;
            return curV;
        },

        _setSize: abstractMethod,

        /**
         * Get pos position
         * @returns {number} current pos position number
         */
        _getPos: function () {
            return this.pos;
        },

        /**
         * Set pos position
         * @param {number} pos set the number.
         */
        _setPos: abstractMethod,

        /**
         * 
         */
        _getEventPos: abstractMethod,

        /**
         * Get container
         * @returns {Element} A parent element.
         */
        getContainer: function () {
            return this.parentEl;
        },

        /**
         * Get height
         * @returns {number} element's height
         */
        getSize: abstractMethod,

        /**
         * Get original size
         * @returns {number} element's original size
         */
        getOriginalSize: abstractMethod,

        /**
         * Get parent height
         * @returns {number} return the parent element height.
         */
        getParentSize: abstractMethod,

        /*! -----------------------------------------------------------
            EVENTS
        --------------------------------------------------------------- */
        /**
         * Mouse down event handler
         * @param {Event} e Event object.
         */
        _down: function (e) {
        
            if (this._autoMoving) {
                return false;
            }

            var curPos = this._getPos(),
                edgePos = -this._getEdge();

            if (curPos > 0) {
                this._setPos(0);
                this._stopScrolling();
            }
            else if (curPos < edgePos) {
                this._setPos(edgePos);
                this._stopScrolling();
            }
            
            this.dragging = true;
            this.trigger('movestart');

            this.prevPos = this._getEventPos(e);
            this.prevT = +new Date();
        },


        /**
         * Mouse move event handler
         * @param {Event} e Event object.
         */
        _move: function (e) {

            e.preventDefault();
            if (!this.dragging) {
                return true;
            }
            clearTimeout(this.stopTimer);

            var oldPos = this._getPos(),
                now = +new Date(),
                t = now - this.prevT,
                pagePos = this._getEventPos(e),
                dist = this.prevPos - pagePos,
                acc = dist / (t || (t = 1)),
                d = (acc - this.prevAcc) / t,
                nextPos = oldPos - dist;

            //calculate Acceleration.
            this.acc += d * t;

            //calculate Velocity.
            this._v = -this.acc * t;

            if (nextPos > 0 || nextPos < -this._getEdge()) {
                nextPos = oldPos - ((dist / 2) | 0);
            }

            //set position
            this._setPos(nextPos);

            //set previous values.
            this.prevT   = now;
            this.prevPos = pagePos;
            this.prevAcc = acc;
        },

        /**
         * Mouse up event handler
         * @param {Event} e
         */
        _up: function (e) {
            if (!this.dragging) {
                return true;
            }
            this.dragging = false;
            this._scrolling();
        },

        /**
         * @param {Event} e Event object.
         */
        update: function (e) {
            this._checkSize();
            this._checkOverflow();
            this.trigger('update');
        }
    });

    //Copy the itself as constructor.
    FixnelBase.prototype.constructor = FixnelBase;


    ////////////////////////////////////////////////////////////////////

    /** @constructor */
    var VFixnel = FixnelBase.extend({
        /*! -----------------------------------------------------------
            GETTER & SETTER
        --------------------------------------------------------------- */
        _getScrollbar: function () {
            return new VScrollbar(this);
        },
        _setSize: function (val) {
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
         * Set y position
         * @param {number} y set the number.
         */
        _setPos: function (pos) {
        
            var matrix = new WebKitCSSMatrix(this.el.style.webkitTransform),
                x = matrix.e;

            this.pos = pos;
            this.el.style.webkitTransform = 'translate3d(' + x + 'px, ' + pos + 'px, 0)';

            this.trigger('move', {
                value: pos
            });
        },

        _getEventPos: function (e) {
            return (e.touches) ? e.touches[0].pageY : e.pageY;
        },

        /**
         * Get height
         * @returns {number} element's height
         */
        getSize: function () {
            return this.el.clientHeight;
        },

        /**
         * Get original height
         * @returns {number} element's original height
         */
        getOriginalSize: function () {

            var curSize;

            //temporary setting to `auto`.
            this.el.style.height = 'auto';

            if (this.el.originalSize !== (curSize = this.getSize())) {
                this.el.originalSize = curSize;
            }

            return this.el.originalSize;
        },

        /**
         * Get parent height
         * @returns {number} return the parent element height.
         */
        getParentSize: function () {
            return this.parentEl.clientHeight;
        }
    });

    VFixnel.prototype.constructor = VFixnel;

    ////////////////////////////////////////////////////////////////////

    /** @constructor */
    var HFixnel = FixnelBase.extend({
        /*! -----------------------------------------------------------
            GETTER & SETTER
        --------------------------------------------------------------- */
        _getScrollbar: function () {
            return new HScrollbar(this);
        },
        _setSize: function (val) {
            if (!val) {
                return false;
            }
            else if (Object.prototype.toString.call(val) === '[object String]') {
                this.el.style.width = val;
                return;
            }

            this.el.style.width = val + 'px';
        },
        /**
         * Set x position
         * @param {number} x set the number.
         */
        _setPos: function (pos) {
        
            var matrix = new WebKitCSSMatrix(this.el.style.webkitTransform),
                y = matrix.f;

            this.pos = pos;
            this.el.style.webkitTransform = 'translate3d(' + pos + 'px, ' + y + 'px, 0)';

            this.trigger('move', {
                value: pos
            });
        },

        _getEventPos: function (e) {
            return (e.touches) ? e.touches[0].pageX : e.pageX;
        },

        /**
         * Get width
         * @returns {number} element's width
         */
        getSize: function () {
            return this.el.clientWidth;
        },

        /**
         * Get original width
         * @returns {number} element's original width
         */
        getOriginalSize: function () {

            var curSize;

            //temporary setting to `auto`.
            this.el.style.width = 'auto';

            if (this.el.originalSize !== (curSize = this.getSize())) {
                this.el.originalSize = curSize;
            }

            return this.el.originalSize;
        },

        /**
         * Get parent width
         * @returns {number} return the parent element width.
         */
        getParentSize: function () {
            return this.parentEl.clientWidth;
        }
    });

    HFixnel.prototype.constructor = HFixnel;

    //////////////////////////////////////////////
    exports.Fixnel = Fixnel;

}(this, document, this));
