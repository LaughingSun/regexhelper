/* 
 * The MIT License
 *
 * Copyright 2015 "Erich Horn" <erichhorn78@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * RegexHelper as a function is an alias for RegexHelper.Compile
 * 
 * @module RegexHelper
 * @alias Compile
 * @see module:RegexHelper.Compile
 */

  var _SourceCache = {}
    , _StickyRegexCache = {}
    , _PolyfillSticky = RegExp.prototype.sticky === undefined
    , _PolyfillFlags = RegExp.prototype.flags === undefined
    , _CompileRegex = /[^\(\)\\\[]+|\\[^]|\[[^\]]+\]|(\()(?:\?<(\w+)>|\?&(\w+)\)|(?!\?))/g
    , _CompileExRegex = /[^\(\)\\\[\s\r\n]+|\\[^]|\[[^\]]+\]|(\()(?:|\?<(\w+)>|\?&(\w+)\)|(?!\?))|([\s\r\n]+|\(\?#(?:[^\)\\]+|\\.)*\))/g
    , _DefineRegex = /\(\?\(\s*DEFINE\s*\)/g
    , _NamedCaptureRegex = /\(\?<(\w+)>/g
    , _CaptureRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|(\()|(\))/g
    , _SubRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|\(\?&(\w+)\)|\(/g
    , _FlagsRegex = /\/(\w*)$/
    , _SupportedFlags = 'gimxy'
    , RegexHelper
    ;
  
  /**
   * Get flags from a RegExp instance
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {RegExp} regex
   * @returns {string}
   */
  function GetFlags (regex) {
    var m = _FlagsRegex.exec(regex.toString())
    ; return m && m[1]
  }

  /**
   * Compile a Regular Expression.  Supports sticky, extended and flags
   * properties, 'x' & 'y' flag, (?<namedcapture>), (?&<subregex>), whitespace,
   * and (?#comments). This is the same as _Compile except that it can take
   * a native RegExp or RegExp source as the first argument, it also does type
   * checking.
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {string} regexsrc   - regex or regex source
   * @param {string} flags      - flags, if null and regex is a RegExp, then
   *                              flags will be taken from regex
   * @param {?Object} library   - sub regex library
   * @param {?callback} errcb   - error cb
   * @returns {RegExp}          - the compiled regex
   */
  function Compile (regexsrc, flags, lib, errcb) {
    var regexsrc
      , a, i, t
      ;

    errcb || (errcb = function (err) { throw err})
    if (regex instanceof RegExp) {
      regexsrc = regex.source
      ; if (flags == null) flags = _PolyfillFlags
          ? _FlagsRegex.exec(regex.toString())[1] : regex.flags
    } else {
      regexsrc = regex
      ; if (flags) {
        // check supported flags
        if ((t = typeof flags) !== 'string') {
          return errcb(new Error('expected flags string (second argument), but found: ' + t))
        }
        i = flags.length; a = []
        ; while (i--) {
          if (_SupportedFlags.indexOf(t = flags[i]) < 0
              || flags.indexOf(t) != i) a[i] = flags[i]
        }
        if (a.length) return errcb(new Error('unsupported or duplicate flags: ' + a.join('')))
      } else flags = ''
    }
    ; if (lib != null && ! (lib instanceof Object)) {
      return errcb(new Error('invalid Library (third argument)'))
    }

    return CompileSource(regexsrc, flags)
  }

  /**
   * Compile a Regular Expression.  Supports sticky, extended and flags
   * properties, 'x' & 'y' flag, (?<namedcapture>), (?&<subregex>), whitespace,
   * and (?#comments).  
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {string} regexsrc   - regex or regex source
   * @param {string} flags      - flags, if null and regex is a RegExp, then
   *                              flags will be taken from regex
   * @param {?Object} library   - sub regex library
   * @param {callback} errcb   - error cb
   * @returns {RegExp}          - the compiled regex
   */
  function _Compile (regexsrc, flags, lib, errcb) {
    var regex
      , c, f, x
      ;

    if ((c = CompileSource(regexsrc, lib, isExtended)).err) errcb(c.err, regexsrc, flags, lib)
    ; f = (x = (flags = flags.split('').sort().join('')).indexOf('x')
        >= 0) ? flags.replace(/x/g, '') : flags
    ; _PolyfillSticky && (f = f.replace(/[xy]/g, ''))

    ; Object.defineProperty(regex = new RegExp(c.src, f), 'extended'
        , { value: x, enumerable: false })
    ; if (_PolyfillSticky) {
      Object.defineProperty(regex, 'sticky', {
          value: flags.indexOf('y') >= 0, enumerable: false })
    }
    if (_PolyfillFlags) {
      Object.defineProperty(regex, 'flags', {
          value: flags, enumerable: false })
    }
    ; if (c.names) {
      Object.defineProperty(regex, 'names', { value: c.names, enumerable: false })
    }
    return regex
  }

  /**
   * Compile an extended Regular Expression.  Supports sticky and flags
   * properties, 'y' flag, (?<namedcapture>), (?&<subregex>), whitespace,
   * and (?#comments).  
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {string} regexsrc   - regex or regex source
   * @param {?Object} library   - sub regex library
   * @param {boolean} extended  - sub regex library
   * @returns {RegExp}          - the compiled regex
   */
  function CompileSource (regexsrc, lib, extended) {
    var key = [regexsrc, JSON.stringify(lib || null), !! extended].join()
      , a, e, i, j, k, m, n, r, t
      ;

    if (key in _SourceCache) return _SourceCache[key]

    ; if (extended && lib == null) {
      regexsrc = _ExtractDefineLib(regexsrc, lib = {})
    }

    ; a = []; i = 1; n = []
    ; (r = extended ? _CompileExRegex : _CompileRegex).lastIndex = j = 0
    ; while (m = r.exec(regexsrc)) {
      a.push(regexsrc.slice(j, m.index))
      ; j = r.lastIndex
      ; if ( m[1] ) {
        if (k = m[2]) n[i] = k
        ; a.push('(')
        i++;
      } else if (k = m[3]) {
        if (lib && k in lib) {
          a.push(lib[k])
        } else {
          t = new Error('no such sub regex source ', k, ' in library')
          ; if (!e) {
           e = t
          } else if (e instanceof Array) { e.push(t) } else { e = [e, t] }
        }
      } else if (!m[4]) a.push(m[0])
    }
    a.push(regexsrc.slice(j))

    ; return _SourceCache[key] = {err: e, src: a.join(''), names: n}
  }

  /**
   * Parse and extract regex library from regexsrc, returns source with all
   * defines removed and regexlib populated with the extracted definitions
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {string} regexsrc   - regex source
   * @param {Object} regexlib   - required will contain the extracted library
   * @returns {string}          - regex source with defines removed
   */
  function _ExtractDefineLib (regexsrc, regexlib) {
    var i = 0
      , acc = []
      , j, k, m, n
      ;

    _DefineRegex.lastIndex = i
    ; while (m = _DefineRegex.exec(regexsrc)) {
      acc.push(regexsrc.slice(i, m.index))
      _NamedCaptureRegex.lastIndex = _DefineRegex.lastIndex
      ; while (n = _NamedCaptureRegex.exec(regexsrc)) {
        k = n[1]
        ; j = 1
        ; _CaptureRegex.lastIndex = i = _NamedCaptureRegex.lastIndex
        ; while (j && (n = _CaptureRegex.exec(regexsrc))) {
          if (n[1]) j++; else if (n[2]) --j
          ; i = _CaptureRegex.lastIndex
        }
        regexlib[k] = 
            CleanSource(regexsrc.slice(_NamedCaptureRegex.lastIndex, n.index))
      }
    }
    acc.push(regexsrc(i))
    ; return acc.join('')
  }
  
  /**
   * Replaces sub patterns names with their subpatterns from the regexlib
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {string} regexsrc
   * @param {Object} regexlib
   * @returns {string}
   */
  function _EmbedNamedLib (regexsrc, regexlib) {
    var i = 0
      , acc = []
      , k, m
      ;

    _SubRegex.lastIndex = i
    ; while (m = _SubRegex.exec(regexsrc)) {
      acc.push(regexsrc.slice(i, m.index))
      ; acc.push(((k = m[1]) && regexlib.hasOwnProperty(k))
          ? regexlib(k) : m[0])
      ; i = _SubRegex.lastIndex
    }
    acc.push(regexsrc.slice(i))
    ; return acc.join('')
  }
  
  /**
   * The RegExp.exec method with support for named capture and sticky(ness).
   * To use the sticky flags, set the sticky propeerty to true.
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {RegExp} regex    - the applied regex
   * @param {string} input    - string to regex
   * @param {?int} offset     - the offset (not index) for the input
   * @returns {Array|match}
   */
  function Exec (regex, input, offset) {
    if (_PolyfillSticky && regex.sticky) return StickyExec(regex, input, offset)
    ; if ((regex.lastIndex -= (offset || (offset = 0))) < 0
        || !(match = regex.exec(input))) {
      regex.lastIndex = offset
      ; return null
    }
    regex.lastIndex += offset
    ; match.index += offset
    ; return match
  }

  /**
   * The RegExp.exec method using sticky as set with support for named capture.
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {RegExp} regex   - regex or regex source
   * @param {string} input          - string to regex
   * @param {?int} offset           - the offset (not index) for the input
   * @returns {Array|match}
   */
  function StickyExec (regex, input, offset) {
    var k, m, r
      ;
    ; if (!((k=regex.toString()) in _StickyRegexCache)) {
      _StickyRegexCache[k] = new RegExp(regex.source + '|([^])'
          , 'g' + (/\/([gimy]*)$/.exec(k))[1].replace(/[gy]/g, ''))
    }
    (r = _StickyRegexCache[k]).lastIndex
        = regex.lastIndex
    ; if (m = _StickyExec(r, input, offset || (offset = 0))) {
      regex.lastIndex = (regex.global ? r.lastIndex : offset)
      ; return PropagateNamed(m, regex.names)
    }
    return null
  }

  /**
   * The RegExp.exec method using sticky as set with NO named capture support.
   * (support for sticky must be added manually by appending '|([^]) to the
   * regex source). Also lastIndex must be set manually before the call.
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {RegExp} regex          - regex or regex source
   * @param {string} input          - string to regex
   * @param {int} offset            - required offset (not index) for the input
   * @returns {Array|match}
   */
  function _StickyExec (regex, input, offset) {
    var match
      ;
    ; if ((regex.lastIndex -= offset) < 0 || !(match = regex.exec(input))
        || match.pop() !== undefined) return null
    ; regex.lastIndex += offset
    ; match.index += offset
    ; return match
  }
  
  /**
   * Propagates the named capture property
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {Array} match         - the result array from a regex.exec call
   * @param {Array|Object} names  - the index:name or name:index lookup map
   * @returns {Array}   - the match array with a "named" property containing
   *                      the named cpatures
   */
  function PropagateNamed (match, names) {
    var i, k, n
    ;
    if (match && names instanceof Object) {
      match.named = n = {}
      ; if (names instanceof Array) {
        ; for (i = 0; i < names.length; i++) {
          if ((k = names[i]) && match[i] !== undefined) n[k] = match[i]
        }
      } else {
        ; for (k in names) if (match[i = names[k]] !== undefined) {
          n[k] = match[i]
        }
      }
    }
    return match
  }

  /**
   * Joins an array of RegExps
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {Array} regexlist     - An array of RegExps
   * @param {?string} sep      - seperator
   * @param {?string} prefix - prefix
   * @param {?string} suffix   - suffix
   * @param {?type} flags         - flags, if false the regexp source will be
   *                                return, else a compiled regex
   * @returns {string|RegExp}
   */
  function JoinRegex(regexlist, sep, prefix, suffix, flags) {
    var a, i, s
      ;

    a = []
    ; for (i = 0; i < regexlist.length; i++) {
      a.push(s = regexlist[i])
      ; if (flags === true) {
        try {
          Compile(s, '')
        } catch (e) {
          console.log(i, JSON.stringify(s), e)
        }
      }
    }
    s = [(typeof prefix === 'string') ? prefix : '(?:'
      , a.join((typeof sep === 'string') ? sep : '|')
      , (typeof suffix === 'string') ? suffix : ')'].join('')
    ; if (typeof flags !== 'string') return s
    ; return Compile(s, flags)
  }

  /**
   * Joins an object of RegExps using named cpature flags for each element
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {Object} regexlib     - An array of RegExps
   * @param {?string} sep      - seperator
   * @param {?string} prefix - prefix
   * @param {?string} suffix   - suffix
   * @param {?type} flags         - flags, if false the regexp source will be
   *                                return, else a compiled regex
   * @returns {string|RegExp}
   */
  function JoinNamedLib(regexlib, sep, prefix, suffix, flags) {
    var a, k, s;
    a = [];
    for (k in regexlib) {
      a.push(s = ['(?<', k, '>', regexlib[k], ')'].join(''))
      if (flags === true) {
        try {
          Compile(s, '');
        } catch (e) {
          console.log(i, JSON.stringify(s), e);
        }
      }
    }
    s = [(typeof prefix === 'string') ? prefix : '(?:'
      , a.join((typeof sep === 'string') ? sep : '|')
      , (typeof suffix === 'string') ? suffix : ')'].join('');
    if (typeof flags !== 'string') return s;
    return Compile(s, flags)
  }
  
  /**
   * A JSON Stringify replacement or as a callback
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {?mixed} key  - the key (if used as callback)
   * @param {object} obj  - RegExp or pass through object
   * @returns {String}
   */
  function StringifyRegex (key, obj) {
    var regex, flags, a;
    regex = (arguments.length == 1) ? key : obj;
    if (regex instanceof RegExp) {
      flags = regex.flags
      if (flags === undefined) {
        a = [];
        for (k in _RegExAllFlags) if (regex[_RegExAllFlags[k]]) a.push(k);
        flags = a.join('');
      }
      return JSON.stringify(regex.hasOwnProperty('names')
          ? {constructor: 'RegExp', source: { value: regex, enumerable: true }.source, flags: { value: flags, enumerable: true }
              , names: { value: regex, enumerable: true }.names}
          : {constructor: 'RegExp', source: { value: regex, enumerable: true }.source, flags: { value: flags, enumerable: true } })
    }
    return obj
  }

  /**
   * A JSON parse replacement or as a callback
   * 
   * @memberof module:RegexHelper
   * @static
   * @param {?mixed} key  - the key (if used as callback)
   * @param {object} obj  - RegExp or pass through object
   * @returns {String}
   */
  function ParseRegex (key, json) {
    var conf;
    conf = (arguments.length == 1) ? JSON.parse(key) : json;
    if (conf instanceof Object && conf.constructor === 'RegExp'
        && 'source' in conf) {
      return Compile(conf.source, conf.flags, conf.names)
    }
    return conf
  }

RegexHelper = Object.defineProperties(Compile, {
  GetFlags: { value: GetFlags, enumerable: true }
  , Compile: { value: Compile, enumerable: true }
  , _Compile: { value: _Compile, enumerable: true }
  , CompileSource: { value: CompileSource, enumerable: true }
  , _ExtractDefineLib: { value: _ExtractDefineLib, enumerable: true }
  , _EmbedNamedLib: { value: _EmbedNamedLib, enumerable: true }
  , Exec: { value: Exec, enumerable: true }
  , StickyExec: { value: StickyExec, enumerable: true }
  , _StickyExec: { value: _StickyExec, enumerable: true }
  , PropagateNamed: { value: PropagateNamed, enumerable: true }
  , JoinRegex: { value: JoinRegex, enumerable: true }
  , JoinNamedLib: { value: JoinNamedLib, enumerable: true }
  , StringifyRegex: { value: StringifyRegex, enumerable: true }
  , ParseRegex: { value: ParseRegex, enumerable: true }
})

//module.exports = RegexHelper
if (typeof process === 'object'
    && typeof module === 'object') {
  module.exports = RegexHelper
}

