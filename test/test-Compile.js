
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
    it('should return a non-cached regex', function(){
      assert.deepEqual(CompileSource("^\\w+$"), /^\w+$/);
    })
    i = -1
    ; s = /^\w+$/.source
    ; while (++i < 16) {
      f = FlagSet(i)
      it(['should return a regex with', f, 'flags'].join(' '), function(){
        r = CompileSource("^\\w+$", f)
        ; assert.equal(r.source, s, 'bad source on ' + r.source);
        ; assert.equal(r.flags, f), 'bad flags on ' + r.flags;
        for (k in flagProperties) {
          assert.equal(r[flagProperties[k]], f.indexOf(k) >= 0, 'bad flag property ' + flagProperties[k]);
        }
      })
    }
  })

})