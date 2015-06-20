var assert = require("assert")
  , fs = require('fs')
  , RegexHelper = require("../src/regexhelper/regexhelper.js")
  , name, fp;

function makeATheTest(name, fp){
  return function(){
    require(fp);
  }
}

describe('RegexHelper', function(){
  it('should be a function', function(){
    assert.equal(typeof RegexHelper, 'function', 'missing RegexHelper')
  })
  for (name in RegexHelper) {
    ; it('running test ' + name, makeATheTest(name, ['./test-', name, '.js'].join('')))
  }
})
