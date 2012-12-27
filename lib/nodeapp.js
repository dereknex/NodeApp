var spawn = require("child_process").spawn;
var path = require("path");
var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	http = require('http');


/**
 * Expose `createApplication()`.
 */



/**
 * Framework version.
 */

exports.version = '1.0.0';
var NodeApp = exports.NodeApp = function(options){
	if(!(this instanceof NodeApp)){
		return new NodeApp(options);
	}
	
	EventEmitter.call(this);
	
	options = options || {};
	this.create(options);
};
util.inherits(NodeApp,EventEmitter);
NodeApp.NodeApp = NodeApp;
exports = module.exports = NodeApp;
_createClient = function(options){
	options = options || {};
	var client;
	var keys = [];
	
	switch(process.platform){
		case 'win32':
			client = path.resolve(__dirname + '/../clients/win32/client.exe');
			keys = ['url', 'name', 'width', 'height', 'minwidth', 'minheight', 'ico', 'cache-path', 'log-file'];
			break;
		case 'darwin':
			client = path.resolve(__dirname + '/../clients/NodeApp.app/Contents/MacOS/NodeApp');
			keys = ['url', 'name', 'width', 'height', 'minwidth', 'minheight', 'ico', 'cache-path', 'log-file'];
			break;	
	}
	var args = [];
	for (var key in options) {
		if (keys.indexOf(key) !== -1) {
			args.push('--' + key + '=' + options[key]);
		}
	}
	var child = spawn(client, args);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	return child; 
}
NodeApp.prototype.create = function(options){
	
	var requestListener = options['requestListener'];
	var port = Math.ceil(Math.random()*5000+3000);
	var app = this;
	var server = http.createServer(requestListener).listen(port, function(){
		var url = "http://localhost:"+port;
		options['url']= url;
		var c = _createClient(options);
		c.on('exit', function(code) {
			console.log('Client exited');
			var listeners = app.listeners('exit');
			if(listeners.length>0){
				app.emit('exit');	
			}else{
				process.exit(code);
			}
			
			   
		});
		console.log("Server listening on port " + port);
	});
	server.on('error',function(data){
		console.log("Fail listening on port " + port);
		create(options);
	});
}

