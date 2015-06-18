
var assert = require("assert")
  , CompileSource = require("../src/regexhelper/regexhelper.js").CompileSource
  , flagProperties = {
    g: "global"
    , i: "ignoreCase"
    , m: "multiline"
    , y: "sticky"
  }
  , FlagSet = function (b) {
    var fs = 'gimy'
      , i = 4
      , a = []
      ;
    while (i--) if ( b & (1<<i) ) a[i] = fs[i]
    ; return a.join('')
  }
  ;

describe('RegexHelper.CompileSource', function(){
  it('should be a function', function(){
    assert.equal(typeof CompileSource, 'function'
        , 'missing RegexHelper.CompileSource');
  })

  describe('.CompileSource("^\\w+$")', function(){
    var f, i, k, r, s
      ;
    it('should return a simple regex', function(){
      assert.deepEqual(CompileSource("^\\w+$"), { err: undefined, src: '^\\w+$', names: [] });
    })
    it('should return a single capture regex', function(){
      assert.deepEqual(CompileSource("^(\\w+)\\s*$"), { err: undefined, src: '^(\\w+)\\s*$', names: [] });
    })
    it('should return a single named capture regex', function(){
      assert.deepEqual(CompileSource("^(?<word>\\w+)\\s*$"), { err: undefined, src: '^(\\w+)\\s*$', names: [, 'word'] });
    })
    it('extended: should return a single named capture regex', function(){
      assert.deepEqual(CompileSource("^(?<word>\\w+)\\s*$", null, true), { err: undefined, src: '^(\\w+)\\s*$', names: [, 'word'] });
    })
  })

})