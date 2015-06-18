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

/** @module RegexHelper */

/**
 * RegexHelper as a function is an alias for RegexHelper.CompileEx
 * 
 * @class RegexHelper
 * @alias CompileEx
 * @see RegexHelper.CompileEx
 */

  var _RegexCache = {}
    , _StickyRegexCache = {}
    , _PolyfillSticky = RegExp.prototype.sticky === undefined
    , _PolyfillFlags = RegExp.prototype.flags === undefined
    , _DefineRegex = /\(\?\(\s*DEFINE\s*\)/g
    , _NamedCaptureRegex = /\(\?<(\w+)>/g
    , _CaptureRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|(\()|(\))/g
    , _SubRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|\(\?&(\w+)\)|\(/g
//    , _CleanRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|(\s+)|(\(\?\((?:[^\)\\]+|\\.)*\))|(\(\?#(?:[^\)\\]+|\\.)*\))|\(/g
    , _CleanRegex = /[^\(\)\\\[]+|\\.|\[[^\]]+\]|(\s+|\(\?#(?:[^\)\\]+|\\.)*\))|(\(\?\((?:[^\)\\]+|\\.)*\))|\(/g

    , _FlagsRegex = /\/(\w*)$/
    , RegexHelper
    ;
  
  /**
   * Compile a Regular Expression.  Supports sticky and flags properties,
   * 'y' flag, and (?<namedcapture>).
   * 
   * @static
   * @param {string|RegExp} regex - regex or regex source
   * @param {?string} flags       - flags, if null and regex is a RegExp, then
   *                                flags will be taken from regex
   * @returns {RegExp}            - the compiled regex
   */
  function Compile (regex, flags) {
    var regexsrc
      ;

    if (regex instanceof RegExp) {
      regexsrc = regex.source
      ; if (flags == null) flags = _PolyfillFlags
          ? _FlagsRegex.exec(regex.toString())[1] : regex.flags
    } else {
      regexsrc = regex
      ; flags || (flags = '');
    }

    return CompileSource(regexsrc, flags)
  }

  /**
   * Compile an extended Regular Expression.  Supports sticky and flags
   * properties, 'y' flag, (?<namedcapture>), (?&<subregex>), whitespace,
   * and (?#comments).  
   * 
   * @static
   * @param {string|RegExp} regex - regex or regex source
   * @param {?string} flags       - flags, if null and regex is a RegExp, then
   *                                flags will be taken from regex
   * @param {?Object} regexlib    - library of sub regexes (name: { value: subregex, enumerable: true })
   * @returns {RegExp}            - the compiled regex
   */
  function CompileEx (regex, flags, regexlib) {
    var regexsrc, lib
      , a, i, k;

    if (regex instanceof RegExp) {
      regexsrc = regex.source
      ; if (flags == null) flags = _PolyfillFlags ? _FlagsRegex.exec(regex.toString())[1] : regex.flags
    } else {
      regexsrc = regex;
      flags || (flags = '');
    }
    if ((k = ['/', regexsrc, '/', flags].join('')) in _RegexCache) return _RegexCache[k];

    return _RegexCache[k] = CompileSource(_EmbedNamedLib(CleanReagex(
        _ExtractDefineLib(regexsrc, regexlib || (regexlib = {}))
        ), regexlib), flags)
  }

  /**
   * Get flags from a RegExp instance
   * 
   * @static
   * @param {RegExp} regex
   * @returns {string}
   */
  function GetFlags (regex) {
    var m = _FlagsRegex.exec(regex.toString())
    ; return m && m[1]
  }

  /**
   * Compile an extended Regular Expression.  Supports sticky and flags
   * properties, 'y' flag, (?<namedcapture>), (?&<subregex>), whitespace,
   * and (?#comments).  
   * 
   * @static
   * @param {string} regexsrc     - regex or regex source
   * @param {?string} flags       - flags, if null and regex is a RegExp, then
   *                                flags will be taken from regex
   * @returns {RegExp}            - the compiled regex
   */
  function CompileSource (regexsrc, flags) {
    var regex, sticky, _flags
      , a, i, k;

    if ((k = ['/', regexsrc, '/', flags].join('')) in _RegexCache) {
      return _RegexCache[k];
    }

    ; if (_PolyfillSticky) {
      sticky = (flags !== (_flags = flags.split('y').join('')))
    } else _flags = flags

    // compile and extract names
    names = [];
    i = 1;
    regexsrc = regexsrc.replace(/\((\?<[\w-]+>|(?!\?))|\\[^]/g, function (m) {
      if (m[0] === '(') {
        if (m[2] === '<') names[i] = m.slice(3, -1);
        i++;
        return '('
      }
      return m
    })
    regex = new RegExp(regexsrc, _flags)
    ; if (_PolyfillSticky) {
      ; Object.defineProperty(regex, 'sticky', {
          value: sticky, enumerable: false })
    } else _flags = flags

    if (_PolyfillFlags) {
      Object.defineProperty(regex, 'flags', {
          value: flags, enumerable: false })
    }
    ; if (Object.keys(names).length) {
      Object.defineProperty(regex, 'names', { value: names, enumerable: false })
    }
    return _RegexCache[k] = regex
  }

  /**
   * Parse and extract regex library from regexsrc, returns source with all
   * defines removed and regexlib populated with the extracted definitions
   * 
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
   * Renoves extended whitespace, comments and special tags, note this will
   * also remove DEFINEs, so extract those first before cleaning.
   * 
   * @static
   * @param {string} regexsrc
   * @returns {string}
   */
  function CleanSource (regexsrc) {
    var i = 0
      , acc = []
      , m
      ;

    _CleanRegex.lastIndex = i
    ; while (m = _CleanRegex.exec(regexsrc)) {
      acc.push(regexsrc.slice(i, m.index))
      ; acc.push(m[1] ? ''
          : m[2] ? '(?:' : m[0])
      ; i = _CleanRegex.lastIndex
    }
    acc.push(regexsrc.slice(i))
    ; return acc.join('')
  }
  
  /**
   * The RegExp.exec method with support for named capture and sticky(ness).
   * To use the sticky flags, set the sticky propeerty to true.
   * 
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
   * @static
   * @param {string|RegExp} regex   - regex or regex source
   * @param {string} input          - string to regex
   * @param {?int} offset           - the offset (not index) for the input
   * @returns {Array|match}
   */
  function StickyExec (regex, input, offset) {
    var k, m, r
      ;
    ; if (!((k=regex.toString()) in _StickyRegexCache)) {
      (_StickyRegexCache[k] = (regex instanceof RegExp)
          ? new RegExp(regex.source + '|([^])', 'g' + (/\/([gimy]*)$/
              .exec(k))[1].replace(/[gy]/g, ''))
          : new RegExp(regex + '|([^])', 'g')).lastIndex = regex.lastIndex
              || offset
    }
    ; if (m = _StickyExec(r = _StickyRegexCache[k], input, offset || 0)) {
      regex.lastIndex = (regex.global ? r.lastIndex : offset || 0)
      ; return PropagateNamed(m, regex.names)
    }
    return null
  }

  /**
   * The RegExp.exec method using sticky as set with NO named capture support.
   * (support for sticky must be added manually by appending '|([^]) to the
   * regex source). Also lastIndex must be set manually before the call.
   * 
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
    var a, i, k, m, s, re;
    a = [];
    for (i = 0; i < regexlist.length; i++) {
      a.push(s = regexlist[i])
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
   * Joins an object of RegExps using named cpature flags for each element
   * 
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
    var a, k, m, s, re;
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

RegexHelper = Object.defineProperties(CompileEx, {
  Compile: { value: Compile, enumerable: true }
  , CompileEx: { value: CompileEx, enumerable: true }
  , GetFlags: { value: GetFlags, enumerable: true }
  , CompileSource: { value: CompileSource, enumerable: true }
  , CleanSource: { value: CleanSource, enumerable: true }
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

module.exports = RegexHelper
// if (typeof process === 'object'
//     && typeof process.title === 'string'
//     && process.title.indexOf('node') >= 0
//     && typeof module === 'object') {
//   module.exports = RegexHelper
// }

