(function (win, doc) {

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

    function Page(el) {
    
        this.init.apply(this, arguments);
    }

    Page.prototype = {
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
        
            var self = this,
                timer = 0;

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
                    self._boundDown();
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
        mousedown: function (e) {
        
            e.preventDefault();

            this.dragging = true;
            this.prevX = e.pageX;
            this.prevY = e.pageY;
            this.prevT = +new Date();
        },
        F: function (N) {

            var x = 0;
            
            return N / -this.K;
        },

        _down: function () {

            var oldY  = this.getY(),
                vy    = this.F(this.getVY()),
                nextY = (oldY + vy);

            if (nextY <= 0) {
                this.setY(0);
                return false;
            }

            this.setY(nextY);
        },

        _up: function () {

            var oldY  = this.getY(),
                vy    = this.F(this.getVY()),
                nextY = (oldY + vy),
                height = this._getBottom();

            if (nextY >= -height) {
                this.setY(-height);
                return false;
            }

            this.setY(nextY);
        },

        _boundDown: function () {

            var self = this;

            clearInterval(this.timer);
            
            this.timer = setInterval(function () {
                if (Math.abs(self.vy) <= 0) {
                    clearInterval(self.timer);
                }
                
                self._down();
            }, this.FPS);
        },

        _boundUp: function () {

            var self = this,
                height = this._getHeight();

            clearInterval(this.timer);
            
            this.timer = setInterval(function () {
                if (Math.abs(self.vy) <= 0) {
                    clearInterval(self.timer);
                }
                
                self._up();
            }, this.FPS);
        },

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

    var p = new Page(dot);
        
}(this, document));
