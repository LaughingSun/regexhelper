var assert = require("assert")
  , RegexHelper = require("../src/regexhelper/regexhelper.js")
  ;

describe('RegexHelper', function(){
  it('should be a function', function(){
    assert.equal(typeof RegexHelper, 'function', 'missing RegexHelper');
  })
  describe('.GetFlags', function(){
    it('should have a GetFlags method', function(){
      assert.equal(typeof RegexHelper.GetFlags, 'function', 'missing RegexHelper.GetFlags');
    })
  })
  describe('.GetFlags(/^$/)', function(){
    it('should return flags of the RegExp instance', function(){
      assert.equal(RegexHelper.GetFlags(/^$/), '');
    })
    it('should return flags of the RegExp instance', function(){
      assert.equal(RegexHelper.GetFlags(/^$/g), 'g');
    })
    it('should return flags of the RegExp instance', function(){
      assert.equal(RegexHelper.GetFlags(/^$/i), 'i');
    })
    it('should return flags of the RegExp instance', function(){
      assert.equal(RegexHelper.GetFlags(/^$/m), 'm');
    })
    it('should return flags of the RegExp instance', function(){
      assert.equal(RegexHelper.GetFlags(/^$/mig), 'gim');
    })
  })
})
