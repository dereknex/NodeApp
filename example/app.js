var NodeApp = require('../index.js');
function requestHandler(req,res){
	res.write('Hello NodeApp!');
	res.end();
}
var app = NodeApp({'requestListener':requestHandler});
app.on('exit',function(){
	console.log('will exit');
	process.exit();
});