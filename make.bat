@uglifyjs --compress -mangle -o ..\..\regexhelper.js .\regexhelper.js
@jsdoc -r README.md src\regexhelper\regexhelper.js -d .\docs 
