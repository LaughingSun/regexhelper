
var assert = require("assert")
  , _EmbedSubroutines = require("../src/regexhelper/regexhelper.js")._EmbedSubroutines
  , regexlib = {
    word1: '\\w+'
    , word2: '(\\w+)'
    , word3: '(?<word>\\w+)'
  }
  ;

describe('RegexHelper._EmbedSubroutines', function(){
  it('should be a function', function(){
    assert.equal(typeof _EmbedSubroutines, 'function'
        , 'missing RegexHelper._EmbedSubroutines');
  })

  describe('._EmbedSubroutines(regexsrc, regexlib, lastIndex)', function(){
    var f, i, k, r, s
      ;
    it('should throw an Error', function() {
      assert.throws(function () {
        _EmbedSubroutines("^(?&no_such_word)\\s*$", regexlib)
      }, Error);
    })
    it('should return a simple capture regex', function() {
      assert.equal(_EmbedSubroutines("^(?&word1)\\s*$", regexlib), '^\\w+\\s*$');
    })
    it('should return a simple capture regex', function() {
      assert.equal(_EmbedSubroutines("^(?&word2)\\s*$", regexlib), '^(\\w+)\\s*$');
    })
    it('should return a simple capture regex', function() {
      assert.equal(_EmbedSubroutines("^(?&word3)\\s*$", regexlib), '^(?<word>\\w+)\\s*$');
    })

  })

})