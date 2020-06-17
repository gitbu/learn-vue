/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
      define(factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
      global.numeral = factory();
  }
}(this, function () {
  /************************************
      Variables
  ************************************/

  var numeral,
      _,
      VERSION = '2.0.6',
      formats = {},
      locales = {},
      defaults = {
          currentLocale: 'zh',
          zeroFormat: null,
          nullFormat: null,
          defaultFormat: '0,0',
          scalePercentBy100: true
      },
      options = {
          currentLocale: defaults.currentLocale,
          zeroFormat: defaults.zeroFormat,
          nullFormat: defaults.nullFormat,
          defaultFormat: defaults.defaultFormat,
          scalePercentBy100: defaults.scalePercentBy100
      };


  /************************************
      Constructors
  ************************************/

  // Numeral prototype object
  function Numeral(input, number) {
      this._input = input;

      this._value = number;
  }

  numeral = function(input) {
      var value,
          kind,
          unformatFunction,
          regexp;

      if (numeral.isNumeral(input)) {
          value = input.value();
      } else if (input === 0 || typeof input === 'undefined') {
          value = 0;
      } else if (input === null || _.isNaN(input)) {
          value = null;
      } else {
        value = input;
      }
      
      return new Numeral(input, value);
  };

  // version number
  numeral.version = VERSION;

  // compare numeral object
  numeral.isNumeral = function(obj) {
      return obj instanceof Numeral;
  };

  // helper functions
  numeral._ = _ = {
      // formats numbers separators, decimals places, signs, abbreviations
      numberToFormat: function(value, format, roundingFunction) {
          var locale = locales[numeral.options.currentLocale],
              negP = false,
              optDec = false,
              leadingCount = 0,
              abbr = '',
              z = 1000000000000,
              y = 100000000,
              w = 10000,
              decimal = '',
              neg = false,
              abbrForce, // force abbreviation
              abs,
              min,
              max,
              power,
              int,
              precision,
              signed,
              thousands,
              output;

          // make sure we never format a null value
          value = value || 0;

          abs = Math.abs(value);

          // see if we should use parentheses for negative number or if we should prefix with a sign
          // if both are present we default to parentheses
          if (numeral._.includes(format, '(')) {
              negP = true;
              format = format.replace(/[\(|\)]/g, '');
          } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
              signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
              format = format.replace(/[\+|\-]/g, '');
          }

          // see if abbreviation is wanted
          if (numeral._.includes(format, 'a')) {
              abbrForce = format.match(/a(w|y|z)?/);

              abbrForce = abbrForce ? abbrForce[1] : false;

              // check for space before abbreviation
              if (numeral._.includes(format, ' a')) {
                  abbr = ' ';
              }

              format = format.replace(new RegExp(abbr + 'a[wyt]?'), '');

              if (abs >= z && !abbrForce || abbrForce === 'z') {
                  // 万亿
                  abbr += locale.abbreviations.z;
                  value = value / z;
              } else if (abs < z && abs >= y && !abbrForce || abbrForce === 'y') {
                  // 亿
                  abbr += locale.abbreviations.y; value = value / y;
              } else if (abs < y && abs >= w && !abbrForce || abbrForce === 'w') {
                  // 万
                  abbr += locale.abbreviations.w;
                  value = value / w;
              }
          }

          // check for optional decimals
          if (numeral._.includes(format, '[.]')) {
              optDec = true;
              format = format.replace('[.]', '.');
          }

          // break number and format
          int = value.toString().split('.')[0];
          precision = format.split('.')[1];
          thousands = format.indexOf(',');
          leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

          if (precision) {
              if (numeral._.includes(precision, '[')) {
                  precision = precision.replace(']', '');
                  precision = precision.split('[');
                  decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
              } else {
                  decimal = numeral._.toFixed(value, precision.length, roundingFunction);
              }

              int = decimal.split('.')[0];

              if (numeral._.includes(decimal, '.')) {
                  decimal = locale.delimiters.decimal + decimal.split('.')[1];
              } else {
                  decimal = '';
              }

              if (optDec && Number(decimal.slice(1)) === 0) {
                  decimal = '';
              }
          } else {
              int = numeral._.toFixed(value, 0, roundingFunction);
          }

          // check abbreviation again after rounding
          if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
              int = String(Number(int) / 1000);

              switch (abbr) {
                  case locale.abbreviations.thousand:
                      abbr = locale.abbreviations.million;
                      break;
                  case locale.abbreviations.million:
                      abbr = locale.abbreviations.billion;
                      break;
                  case locale.abbreviations.billion:
                      abbr = locale.abbreviations.trillion;
                      break;
              }
          }


          // format number
          if (numeral._.includes(int, '-')) {
              int = int.slice(1);
              neg = true;
          }

          if (int.length < leadingCount) {
              for (var i = leadingCount - int.length; i > 0; i--) {
                  int = '0' + int;
              }
          }

          if (thousands > -1) {
              int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
          }

          if (format.indexOf('.') === 0) {
              int = '';
          }

          output = int + decimal + (abbr ? abbr : '');

          if (negP) {
              output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
          } else {
              if (signed >= 0) {
                  output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
              } else if (neg) {
                  output = '-' + output;
              }
          }

          return output;
      },
      isNaN: function(value) {
          return typeof value === 'number' && isNaN(value);
      },
      includes: function(string, search) {
          return string.indexOf(search) !== -1;
      },
      insert: function(string, subString, start) {
          return string.slice(0, start) + subString + string.slice(start);
      },
      reduce: function(array, callback /*, initialValue*/) {
          if (this === null) {
              throw new TypeError('Array.prototype.reduce called on null or undefined');
          }

          if (typeof callback !== 'function') {
              throw new TypeError(callback + ' is not a function');
          }

          var t = Object(array),
              len = t.length >>> 0,
              k = 0,
              value;

          if (arguments.length === 3) {
              value = arguments[2];
          } else {
              while (k < len && !(k in t)) {
                  k++;
              }

              if (k >= len) {
                  throw new TypeError('Reduce of empty array with no initial value');
              }

              value = t[k++];
          }
          for (; k < len; k++) {
              if (k in t) {
                  value = callback(value, t[k], k, t);
              }
          }
          return value;
      },
      /**
       * Computes the multiplier necessary to make x >= 1,
       * effectively eliminating miscalculations caused by
       * finite precision.
       */
      multiplier: function (x) {
          var parts = x.toString().split('.');

          return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
      },
      /**
       * Given a variable number of arguments, returns the maximum
       * multiplier that must be used to normalize an operation involving
       * all of them.
       */
      correctionFactor: function () {
          var args = Array.prototype.slice.call(arguments);

          return args.reduce(function(accum, next) {
              var mn = _.multiplier(next);
              return accum > mn ? accum : mn;
          }, 1);
      },
      /**
       * Implementation of toFixed() that treats floats more like decimals
       *
       * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
       * problems for accounting- and finance-related software.
       */
      toFixed: function(value, maxDecimals, roundingFunction, optionals) {
          var splitValue = value.toString().split('.'),
              minDecimals = maxDecimals - (optionals || 0),
              boundedPrecision,
              optionalsRegExp,
              power,
              output;

          // Use the smallest precision value possible to avoid errors from floating point representation
          if (splitValue.length === 2) {
            boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
          } else {
            boundedPrecision = minDecimals;
          }

          power = Math.pow(10, boundedPrecision);

          // Multiply up by precision, round accurately, then divide and use native toFixed():
          output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

          if (optionals > maxDecimals - boundedPrecision) {
              optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
              output = output.replace(optionalsRegExp, '');
          }

          return output;
      }
  };

  // avaliable options
  numeral.options = options;

  // avaliable formats
  numeral.formats = formats;

  // avaliable formats
  numeral.locales = locales;

  // This function sets the current locale.  If
  // no arguments are passed in, it will simply return the current global
  // locale key.
  numeral.locale = function(key) {
      if (key) {
          options.currentLocale = key.toLowerCase();
      }

      return options.currentLocale;
  };

  // This function provides access to the loaded locale data.  If
  // no arguments are passed in, it will simply return the current
  // global locale object.
  numeral.localeData = function(key) {
      if (!key) {
          return locales[options.currentLocale];
      }

      key = key.toLowerCase();

      if (!locales[key]) {
          throw new Error('Unknown locale : ' + key);
      }

      return locales[key];
  };

  numeral.reset = function() {
      for (var property in defaults) {
          options[property] = defaults[property];
      }
  };

  numeral.zeroFormat = function(format) {
      options.zeroFormat = typeof(format) === 'string' ? format : null;
  };

  numeral.nullFormat = function (format) {
      options.nullFormat = typeof(format) === 'string' ? format : null;
  };

  numeral.defaultFormat = function(format) {
      options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
  };

  numeral.register = function(type, name, format) {
      name = name.toLowerCase();

      if (this[type + 's'][name]) {
          throw new TypeError(name + ' ' + type + ' already registered.');
      }

      this[type + 's'][name] = format;

      return format;
  };


  /************************************
      Numeral Prototype
  ************************************/

  numeral.fn = Numeral.prototype = {
      clone: function() {
          return numeral(this);
      },
      format: function(inputString, roundingFunction) {
          var value = this._value,
              format = inputString || options.defaultFormat,
              kind,
              output,
              formatFunction;

          // make sure we have a roundingFunction
          roundingFunction = roundingFunction || Math.round;

          // format based on value
          if (value === 0 && options.zeroFormat !== null) {
              output = options.zeroFormat;
          } else if (value === null && options.nullFormat !== null) {
              output = options.nullFormat;
          } else {
              for (kind in formats) {
                  if (format.match(formats[kind].regexps.format)) {
                      formatFunction = formats[kind].format;

                      break;
                  }
              }

              formatFunction = formatFunction || numeral._.numberToFormat;

              output = formatFunction(value, format, roundingFunction);
          }

          return output;
      },
      value: function() {
          return this._value;
      },
      input: function() {
          return this._input;
      },
      set: function(value) {
          this._value = Number(value);

          return this;
      },
  };

  /************************************
      Default Locale && Format
  ************************************/

  numeral.register('locale', 'zh', {
      delimiters: {
          thousands: ',',
          decimal: '.'
      },
      abbreviations: {
          q: '千',
          w: '万',
          y: '亿',
          z: '万亿',
      },
      ordinal: function(number) {
          var b = number % 10;
          return (~~(number % 100 / 10) === 1) ? 'th' :
              (b === 1) ? 'st' :
              (b === 2) ? 'nd' :
              (b === 3) ? 'rd' : 'th';
      },
      currency: {
          symbol: '$'
      }
  });

(function() {
      numeral.register('format', 'percentage', {
      regexps: {
          format: /(%)/,
          unformat: /(%)/
      },
      format: function(value, format, roundingFunction) {
          var space = numeral._.includes(format, ' %') ? ' ' : '',
              output;

          if (numeral.options.scalePercentBy100) {
              value = value * 100;
          }

          // check for space before %
          format = format.replace(/\s?\%/, '');

          output = numeral._.numberToFormat(value, format, roundingFunction);

          if (numeral._.includes(output, ')')) {
              output = output.split('');

              output.splice(-1, 0, space + '%');

              output = output.join('');
          } else {
              output = output + space + '%';
          }

          return output;
      },
  });
})();


(function() {
      numeral.register('format', 'date', {
      regexps: {
          format: /Y+|y+|M+|d+|h+|m+|s+|q+|S+/g,
      },
      format: function(value, format, roundingFunction) {
        fmt = format;
        if (!value) return '';

        const FUTURE_TIMESTAMP = new Date('3000/01/01 00:00:00').getTime();
      
        let date;
        let data = value;
        if (
          typeof(value) === 'number'
        ) {
          if (value* 1000 < FUTURE_TIMESTAMP) {
            date = value * 1000;
          } else {
            date = value;
          }
        }
        if (typeof(value) === 'string') {
          // 这里是为了兼容ios遇到2020-02-20 14:07:30格式的时间会不兼容
          date = value.replace(/\-/g, '/');
        }

        if (date) {
          data = new Date(date);
        }
      
      
        const o = {
          "M+": data.getMonth() + 1, //月份
          "d+": data.getDate(), //日
          "h+": data.getHours(), //小时
          "m+": data.getMinutes(), //分
          "s+": data.getSeconds(), //秒
          "q+": Math.floor((data.getMonth() + 3) / 3), //季度
          "S": data.getMilliseconds() //毫秒
        };
        if (/(y+|Y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
      
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) { 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
      
        return fmt;
      },
  });
})();

return numeral;
}));
