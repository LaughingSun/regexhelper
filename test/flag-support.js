var flagProperties = {
    g: "global"
    , i: "ignoreCase"
    , m: "multiline"
    , x: "extended"
    , y: "sticky"
  }
  , FlagSet = function (b) {
    var fs = Object.keys(flagProperties).join('')
      , i = fs.length
      , a = []
      ;
    while (i--) if ( b & (1<<i) ) a[i] = fs[i]
    ; return a.join('')
  }
  ;

(module.exports = FlagSet).flagProperties = flagProperties
