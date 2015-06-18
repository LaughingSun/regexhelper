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
  describe('.Compile', function(){
    it('should have a GetFlags method', function(){
      assert.equal(typeof RegexHelper.Compile, 'function', 'missing RegexHelper.Compile');
    })
  })
  describe('.Compile(/^\\w+$/)', function(){
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/).source, '^\\w+$');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$').source, '^\\w+$');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/).flags, '');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/g).flags, 'g');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/i).flags, 'i');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/m).flags, 'm');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/mig).flags, 'gim');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile(/^\w+$/, '').flags, '');
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$', 'g').global, true);
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$', 'i').ignoreCase, true);
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$', 'm').multiline, true);
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$', 'y').sticky, true);
    })
    it('should return the RegExp instance', function(){
      assert.equal(RegexHelper.Compile('^\\w+$', 'ymig').flags, 'gimy');
    })
  })
})
