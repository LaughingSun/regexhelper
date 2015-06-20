
var assert = require("assert")
  , _ExtractSubroutines = require("../src/regexhelper/regexhelper.js")._ExtractSubroutines
  ;

describe('RegexHelper._ExtractSubroutines', function(){
  it('should be a function', function(){
    assert.equal(typeof _ExtractSubroutines, 'function'
        , 'missing RegexHelper._ExtractSubroutines');
  })

  describe('._ExtractSubroutines(regexsrc, regexlib, lastIndex)', function(){
    var f, i, k, lib, r, s, t
      ;
    it('returns the same', function() {
      assert.equal(_ExtractSubroutines(
          t = "^A whole bunch of stuff but no DEFINE$", lib = {}), t);
      assert.deepEqual(lib, { });
    })
    it('returns src without the extracted single subroutine', function() {
      assert.equal(_ExtractSubroutines("^(?(DEFINE)((?<word>\\w+)))body body"
          , lib = {}), "^body body");
      assert.deepEqual(lib, { word: '\\w+' });
    })
    it('returns src without the extracted (2) subroutines', function() {
      assert.equal(_ExtractSubroutines(
          "^(?(DEFINE)((?<number>\\d+)(?<word>\\w+)))body body"
          , lib = {}), "^body body");
      assert.deepEqual(lib, { number: '\\d+', word: '\\w+' });
    })
    it('returns src without the extracted (2) subroutines or comments', function() {
      assert.equal(_ExtractSubroutines(
          "^head (?#comment) head (?(DEFINE)((?<number>\\d+)(?<word>\\w+)))body (?#comment) body"
          , lib = {}), "^head  head body  body");
      assert.deepEqual(lib, { number: '\\d+', word: '\\w+' });
    })
    it('returns src without the extracted (2) subroutines or comments', function() {
      assert.equal(_ExtractSubroutines(
          "^head (?#comment) head (?(DEFINE)(\n(?<number>\\d+)\t(?#a number)\n(?<word>\\w+)\t(?#a word)\n))body (?#comment) body"
          , lib = {}), "^head  head body  body");
      assert.deepEqual(lib, { number: '\\d+', word: '\\w+' });
    })

  })

})