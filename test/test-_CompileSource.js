
var assert = require("assert")
  , _CompileSource = require("../src/regexhelper/regexhelper.js")._CompileSource
  ;

describe('RegexHelper._CompileSource', function(){
  it('should be a function', function(){
    assert.equal(typeof _CompileSource, 'function'
        , 'missing RegexHelper._CompileSource');
  })

  describe('._CompileSource(regexsrc, extended, lastIndex)', function(){
    var f, i, k, r, s
      ;
    it('should return a single regex', function() {
      assert.deepEqual(_CompileSource("^\\w+$"), { src: '^\\w+$', names: [], lastIndex: 5 });
    })
    it('should return a single capture regex', function() {
      assert.deepEqual(_CompileSource("^(\\w+)\\s*$"), { src: '^(\\w+)\\s*$', names: [], lastIndex: 10 });
    })
    it('should return a single capture regex from offset 2', function() {
      assert.deepEqual(_CompileSource("^(\\w+)\\s*$", undefined, 2 ), { src: '\\w+', names: [], lastIndex: 5 });
    })
    it('should return a single named capture regex', function() {
      assert.deepEqual(_CompileSource("^(?<word>\\w+)\\s*$"), { src: '^(\\w+)\\s*$', names: [, 'word'], lastIndex: 17 });
    })
    it('should return a single named capture regex from offset 2', function() {
      assert.deepEqual(_CompileSource("^(?<word>\\w+)\\s*$", undefined, 9 ), { src: '\\w+', names: [], lastIndex: 12 });
    })

    it('should return an extended single regex with ws', function() {
      assert.deepEqual(_CompileSource("^ \\w+ $", false), { src: '^ \\w+ $', names: [], lastIndex: 7 });
    })
    it('should return an extended single capture regex with ws', function() {
      assert.deepEqual(_CompileSource("^ (\\w+) \\s* $", false), { src: '^ (\\w+) \\s* $', names: [], lastIndex: 13 });
    })
    it('should return an extended single capture regex from offset 3 with ws', function() {
      assert.deepEqual(_CompileSource("^ (\\w+) \\s* $", false, 3 ), { src: '\\w+', names: [], lastIndex: 6 });
    })
    it('should return an extended single named capture regex with ws', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+) \\s* $", false), { src: '^ (\\w+) \\s* $', names: [, 'word'], lastIndex: 20 });
    })
    it('should return an extended single named capture regex from offset 10 with ws', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+) \\s* $", false, 10 ), { src: '\\w+', names: [], lastIndex: 13 });
    })

    it('should return an extended single regex with ws', function() {
      assert.deepEqual(_CompileSource("^ \\w+ (?#a word) $", false), { src: '^ \\w+ (?#a word', names: [], lastIndex: 15 });
    })
    it('should return an extended single capture regex with ws', function() {
      assert.deepEqual(_CompileSource("^ (\\w+ (?#a word)) \\s* $", false), { src: '^ (\\w+ (?#a word)', names: [], lastIndex: 17 });
    })
    it('should return an extended single capture regex from offset 3 with ws', function() {
      assert.deepEqual(_CompileSource("^ (\\w+ (?#a word)) \\s* $", false, 3 ), { src: '\\w+ (?#a word', names: [], lastIndex: 16 });
    })
    it('should return an extended single named capture regex with ws', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+ (?#a word)) \\s* $", false), { src: '^ (\\w+ (?#a word)', names: [, 'word'], lastIndex: 24 });
    })
    it('should return an extended single named capture regex from offset 10 with ws', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+ (?#a word)) \\s* $", false, 10 ), { src: '\\w+ (?#a word', names: [], lastIndex: 23 });
    })

    /* extended test */
    it('should return an extended single regex', function() {
      assert.deepEqual(_CompileSource("^\\w+$", true), { src: '^\\w+$', names: [], lastIndex: 5 });
    })
    it('should return an extended single capture regex', function() {
      assert.deepEqual(_CompileSource("^(\\w+)\\s*$", true), { src: '^(\\w+)\\s*$', names: [], lastIndex: 10 });
    })
    it('should return an extended single capture regex from offset 2', function() {
      assert.deepEqual(_CompileSource("^(\\w+)\\s*$", true, 2 ), { src: '\\w+', names: [], lastIndex: 5 });
    })
    it('should return an extended single named capture regex', function() {
      assert.deepEqual(_CompileSource("^(?<word>\\w+)\\s*$", true), { src: '^(\\w+)\\s*$', names: [, 'word'], lastIndex: 17 });
    })
    it('should return an extended single named capture regex from offset 9', function() {
      assert.deepEqual(_CompileSource("^(?<word>\\w+)\\s*$", true, 9 ), { src: '\\w+', names: [], lastIndex: 12 });
    })

    it('should return an extended single regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ \\w+ $", true), { src: '^\\w+$', names: [], lastIndex: 7 });
    })
    it('should return an extended single capture regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (\\w+) \\s* $", true), { src: '^(\\w+)\\s*$', names: [], lastIndex: 13 });
    })
    it('should return an extended single capture regex from offset 3 with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (\\w+) \\s* $", true, 3 ), { src: '\\w+', names: [], lastIndex: 6 });
    })
    it('should return an extended single named capture regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+) \\s* $", true), { src: '^(\\w+)\\s*$', names: [, 'word'], lastIndex: 20 });
    })
    it('should return an extended single named capture regex from offset 10 with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+) \\s* $", true, 10 ), { src: '\\w+', names: [], lastIndex: 13 });
    })

    it('should return an extended single regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ \\w+ (?#a word) $", true), { src: '^\\w+$', names: [], lastIndex: 18 });
    })
    it('should return an extended single capture regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (\\w+ (?#a word)) \\s* $", true), { src: '^(\\w+)\\s*$', names: [], lastIndex: 24 });
    })
    it('should return an extended single capture regex from offset 3 with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (\\w+ (?#a word)) \\s* $", true, 3 ), { src: '\\w+', names: [], lastIndex: 17 });
    })
    it('should return an extended single named capture regex with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+ (?#a word)) \\s* $", true), { src: '^(\\w+)\\s*$', names: [, 'word'], lastIndex: 31 });
    })
    it('should return an extended single named capture regex from offset 10 with ws removed', function() {
      assert.deepEqual(_CompileSource("^ (?<word>\\w+ (?#a word)) \\s* $", true, 10 ), { src: '\\w+', names: [], lastIndex: 24 });
    })

  })

})