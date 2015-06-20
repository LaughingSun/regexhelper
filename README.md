# regexhelper
a RegExp helper Library - work in both nodejs and browsers

To install clone to desktop, or download and decompress to your library or script deirectory.

Node usage:
var RegexHelper = require('regexhelper.js'),

In browser:
<script src="regexhelper.js"></script>


Example:
var // RegexHelper = require('regexhelper.js')  // or use a script tag depending on platform
  , RegexExec = RegexHelper.Exec,
  , myregex = RegexHelper('\\s*(?:(?<token)?\\s*)?', 'gxy', {
    token: '(?<number>(?:\d++(?:\\.\\d*)?|\\.\\d+)|(?:[eE][+-]?\\d+)?)|(?<ident>\\w+)|(?<symb>[!@#$%\^&*(){}|\\[\]:;<>,\\.?\\/]+)'
  })
  , input = 'all the things I wanted to say but felt I could\'nt'
  , acc = []
  , m
  ;
  
while (m = RegexExec(myregex, input)) acc.push(m)
; console.log(acc)  // dumps a array of matches found

I could make claims but I don't want to piss off the other libraries...  THe truth is out there.

Anyway it is a lean library with both type checking and non type checking plus optional error callbacks.

You can clone or download the library at https://github.com/LaughingSun/regexhelper

or

You can check out the API docs at http://laughingsun.github.io/proj/regexhelper/docs/module-RegexHelper.html

Happy regexing!



  
