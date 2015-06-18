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
  describe('.CompileSource', function(){
    it('should have a GetFlags method', function(){
      assert.equal(typeof RegexHelper.Compile, 'function', 'missing RegexHelper.Compile');
    })
  })
  describe('.CompileSource("^\\w+$", "")', function(){
    it('should return a regex', function(){
      assert.deepEqual(RegexHelper.CompileSource("^\\w+$", ""), /^\w+$/);
    })
  })
  describe('.CompileSource("^\\w+$")', function(){
    it('should return a regex', function(){
      assert.deepEqual(RegexHelper.CompileSource("^\\w+$"), /^\w+$/);
    })
  })
  // describe('.Compile', function(){
  //   it('should have a GetFlags method', function(){
  //     assert.equal(typeof RegexHelper.Compile, 'function', 'missing RegexHelper.Compile');
  //   })
  // })
  // describe('.Compile(/^\\w+$/)', function(){
  //   it('should return the RegExp source', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/).source, '^\\w+$');
  //   })
  //   it('should return the RegExp source', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$').source, '^\\w+$');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/).flags, '');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/g).flags, 'g');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/i).flags, 'i');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/m).flags, 'm');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/mig).flags, 'gim');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile(/^\w+$/, '').flags, '');
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$', 'g').global, true);
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$', 'i').ignoreCase, true);
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$', 'm').multiline, true);
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$', 'y').sticky, true);
  //   })
  //   it('should return the RegExp flags', function(){
  //     assert.equal(RegexHelper.Compile('^\\w+$', 'ymig').flags, 'gimy')
  //   })
  //   it('should be equal', function(){
  //     assert.equal(RegexHelper.Exec(RegexHelper.Compile('(\\w+)\\s*', 'y')
  //       , 'Because I am the Ester Bester tester').join()
  //       , "Because ,Because");
  //   })
  //   it('should be equal', function(){
  //     assert.equal(RegexHelper.StickyExec(RegexHelper.Compile('(\\w+)\\s*')
  //       , 'Because I am the Ester Bester tester').join()
  //       , "Because ,Because");
  //   })
  //   it('should be equal', function(){
  //     var re1, re2
  //       ;
  //     (re1 = RegexHelper.Compile('(\\w+)\\s*', 'y')).lastIndex = 20
  //     ; (re2 = RegexHelper.Compile('(\\w+)\\s*')).lastIndex = 20
  //     assert.deepEqual(RegexHelper.Exec(re1
  //       , 'Because I am the Ester Bester tester', 10)
  //       , RegexHelper.StickyExec(re2
  //       , 'Because I am the Ester Bester tester', 10))
  //   })
  //   it('should NOT be equal', function(){
  //     var re1, re2
  //       ;
  //     (re1 = RegexHelper.Compile('(\\w+)\\s*', 'y')).lastIndex = 10
  //     ; (re2 = RegexHelper.Compile('(\\w+)\\s*')).lastIndex = 20
  //     assert.notDeepEqual(RegexHelper.Exec(re1
  //       , 'Because I am the Ester Bester tester', 0)
  //       , RegexHelper.StickyExec(re2
  //       , 'Because I am the Ester Bester tester', 10))
  //   })
  //   it('should be equal', function(){
  //     var re1, re2
  //       ;
  //     (re1 = RegexHelper.Compile('(\\w+)\\s*', 'gy')).lastIndex = 10
  //     ; (re2 = RegexHelper.Compile('(\\w+)\\s*', 'gy')).lastIndex = 10
  //     assert.deepEqual(RegexHelper.Exec(re1
  //       , 'Because I am the Ester Bester tester', 10)
  //       , RegexHelper.StickyExec(re2
  //       , 'Because I am the Ester Bester tester', 10))
  //     assert.deepEqual(RegexHelper.Exec(re1
  //       , 'Because I am the Ester Bester tester', 10)
  //       , RegexHelper.StickyExec(re2
  //       , 'Because I am the Ester Bester tester', 10))
  //   })
  // })
})
