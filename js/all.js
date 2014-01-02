// Generated by CoffeeScript 1.6.3
(function() {
  var DrawableObject, Projection, Screen, Spiral, Tree, screen,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DrawableObject = (function() {
    function DrawableObject() {
      this.computedLineSegments = this.computeLineSegments();
    }

    DrawableObject.prototype.lineSegments = function(offset) {
      return this.computedLineSegments[offset];
    };

    DrawableObject.prototype.computeLineSegments = function() {
      return [];
    };

    return DrawableObject;

  })();

  Spiral = (function(_super) {
    var factor, getPointByAngle, getdtheta, linelength, linespacing, rate, shapeColor, spiralShadows, thetamax, thetamin;

    __extends(Spiral, _super);

    thetamin = 0;

    thetamax = 6 * Math.PI;

    rate = 1 / (2 * Math.PI);

    factor = rate / 3;

    linespacing = 1 / 30;

    linelength = linespacing / 2;

    spiralShadows = [
      {
        offset: 0,
        factor_rate: 1,
        color_rate: 0
      }, {
        offset: Math.PI * 0.05,
        factor_rate: 0.93,
        color_rate: -0.7
      }, {
        offset: Math.PI * 0.08,
        factor_rate: 0.9,
        color_rate: -0.85
      }
    ];

    function Spiral(foreground, angleoffset, period, config) {
      this.foreground = foreground;
      this.angleoffset = angleoffset;
      this.period = period;
      if (config == null) {
        config = {};
      }
      this.spacing = config.spacing || 1 / 30;
      this.rate = config.rate || 1 / (2 * Math.PI);
      this.offset = 0;
      this.factor = config.factor || factor;
      this.linelength = config.linelength || linelength;
      Spiral.__super__.constructor.apply(this, arguments);
    }

    Spiral.prototype.computeLineSegments = function() {
      var inc, lineSegments, lines, offset, shadow, theta, thetanew, thetaold, _i, _len;
      lineSegments = [];
      offset = 0;
      while (offset > -this.period) {
        lineSegments[offset] = lines = [];
        for (_i = 0, _len = spiralShadows.length; _i < _len; _i++) {
          shadow = spiralShadows[_i];
          theta = thetamin + getdtheta(thetamin, offset * this.spacing / this.period, this.rate, this.factor * shadow.factor_rate);
          while (theta < thetamax) {
            inc = getdtheta(theta, linespacing, rate, factor);
            thetaold = theta >= thetamin ? theta : thetamin;
            thetanew = theta + getdtheta(theta, linelength, rate, factor);
            theta += inc;
            if (thetanew <= thetamin) {
              continue;
            }
            lines.push({
              start: getPointByAngle(thetaold, this.factor * shadow.factor_rate, this.angleoffset - shadow.offset, this.rate),
              end: getPointByAngle(thetanew, this.factor * shadow.factor_rate, this.angleoffset - shadow.offset, this.rate),
              color: shapeColor(this.foreground, shadow.color_rate)
            });
          }
        }
        offset--;
      }
      return lineSegments;
    };

    getPointByAngle = function(theta, factor, offset, rate) {
      var x, y, z;
      x = theta * factor * Math.cos(theta + offset);
      y = rate * theta;
      z = -theta * factor * Math.sin(theta + offset);
      return {
        x: x,
        y: y,
        z: z,
        alpha: Math.atan((y * factor / rate * 0.1 + 0.02 - z) * 40) * 0.35 + 0.65
      };
    };

    getdtheta = function(theta, lineLength, rate, factor) {
      return lineLength / Math.sqrt(rate * rate + factor * factor * theta * theta);
    };

    shapeColor = function(hex, lum) {
      var c, i, rgb, _i;
      hex = String(hex).replace(/[^0-9a-f]/g, "");
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;
      rgb = "#";
      i = 0;
      for (i = _i = 0; _i < 3; i = ++_i) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
      }
      return rgb;
    };

    return Spiral;

  })(DrawableObject);

  Tree = (function(_super) {
    var colors, height, period, width;

    __extends(Tree, _super);

    period = 5;

    width = 500;

    height = 500;

    colors = ['#ff0000', '#d4a017', '#00ff00', '#ffffff'];

    function Tree() {
      var color, dtheta, i, _i, _len;
      this.spirals = [];
      dtheta = Math.PI * 2 / colors.length;
      for (i = _i = 0, _len = colors.length; _i < _len; i = ++_i) {
        color = colors[i];
        this.spirals.push(new Spiral(color, dtheta * i, period));
      }
      Tree.__super__.constructor.apply(this, arguments);
    }

    Tree.prototype.computeLineSegments = function() {
      var i, lineSegments, spiral, _i, _j, _k, _len, _ref;
      lineSegments = [];
      for (i = _i = 0; 0 <= -period ? _i < -period : _i > -period; i = 0 <= -period ? ++_i : --_i) {
        lineSegments[i] = [];
      }
      _ref = this.spirals;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        spiral = _ref[_j];
        for (i = _k = 0; 0 <= -period ? _k < -period : _k > -period; i = 0 <= -period ? ++_k : --_k) {
          lineSegments[i] = lineSegments[i].concat(spiral.lineSegments(i));
        }
      }
      return lineSegments;
    };

    return Tree;

  })(DrawableObject);

  Projection = (function() {
    var xscreenoffset, xscreenscale, ycamera, yscreenoffset, yscreenscale, zcamera;

    xscreenoffset = 260;

    yscreenoffset = 300;

    xscreenscale = 360;

    yscreenscale = 360;

    ycamera = 2;

    zcamera = -3;

    function Projection(config) {
      this.xscreenoffset = config.xscreenoffset || yscreenoffset;
      this.yscreenoffset = config.yscreenoffset || yscreenoffset;
      this.xscreenscale = config.xscreenscale || xscreenscale;
      this.yscreenscale = config.yscreenscale || yscreenscale;
      this.ycamera = config.ycamera || ycamera;
      this.zcamera = config.zcamera || zcamera;
    }

    Projection.prototype.to2d = function(x, y, z) {
      return {
        x: this.xscreenoffset + this.xscreenscale * (x / (z - this.zcamera)),
        y: this.yscreenoffset + this.yscreenscale * ((y - this.ycamera) / (z - this.zcamera))
      };
    };

    return Projection;

  })();

  Screen = (function() {
    var colors, height, period, screenConfig, width;

    period = 5;

    width = 500;

    height = 500;

    colors = ['#ff0000', '#d4a017', '#00ff00', '#ffffff'];

    screenConfig = {
      xscreenoffset: 260,
      yscreenoffset: 300,
      xscreenscale: 360,
      yscreenscale: 360,
      ycamera: 2,
      zcamera: -3
    };

    function Screen(elem, config) {
      var color, dtheta, i, _i, _len;
      this.elem = document.getElementById(elem);
      this.width = config.width || width;
      this.height = config.height || height;
      this.offset = 0;
      this.elem.setAttribute('width', "" + this.width + "px");
      this.elem.setAttribute('height', "" + this.height + "px");
      this.projection = new Projection(screenConfig);
      this.ctx = this.elem.getContext('2d');
      this.tree = new Tree;
      this.spirals = [];
      dtheta = Math.PI * 2 / colors.length;
      for (i = _i = 0, _len = colors.length; _i < _len; i = ++_i) {
        color = colors[i];
        this.spirals.push(new Spiral(color, dtheta * i, period));
      }
    }

    Screen.prototype.run = function() {
      this.requestAnimationFrame();
      return this.renderFrame();
    };

    Screen.prototype.renderFrame = function() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.beginPath();
      this.offset -= 1;
      if (this.offset <= -period) {
        this.offset += period;
      }
      return this.renderObject(this.tree.lineSegments(this.offset));
    };

    Screen.prototype.renderObject = function(segments) {
      var end, s, start, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = segments.length; _i < _len; _i++) {
        s = segments[_i];
        start = this.projection.to2d(s.start.x, s.start.y, s.start.z);
        end = this.projection.to2d(s.end.x, s.end.y, s.end.z);
        this.stroke(s.color, s.start.alpha);
        this.ctx.moveTo(start.x, start.y);
        _results.push(this.ctx.lineTo(end.x, end.y));
      }
      return _results;
    };

    Screen.prototype.stroke = function(color, alpha) {
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.strokeStyle = color;
      this.ctx.globalAlpha = alpha;
      return this.ctx.beginPath();
    };

    Screen.prototype.requestAnimationFrame = function() {
      var _this = this;
      return window.setTimeout(function() {
        return _this.run();
      }, 1000 / 24);
    };

    return Screen;

  })();

  screen = new Screen('scene', {});

  screen.run();

}).call(this);
