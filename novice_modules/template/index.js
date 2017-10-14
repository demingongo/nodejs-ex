// module.exports = require('./lib/template-html5');

var templating = function(title ,bodycontent , headcontent) {
    var tmp = '<!DOCTYPE html>'+
'<html>'+
'    <head>'+
'        <meta charset="utf-8" />'+
		headcontent+
'        <title>'+title+'</title>'+
'    </head>'+ 
'    <body>'+bodycontent+'</body>'+
'</html>';
return tmp;
}

exports.templating = templating;
