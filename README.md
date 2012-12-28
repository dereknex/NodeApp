NodeApp
-------

Writing desktop applications with all node.js technologies.

# Introduction

NodeApp is an way to develop desktop application with `node.js` and web technologies.

# Install



	npm install nodeapp

# Tutorial

	var NodeApp = require('nodeapp');
	function requestHandler(req,res){
		res.write('Hello NodeApp!');
		res.end();
	}
	var app = NodeApp({'requestListener':requestHandler});
	app.on('exit',function(){
		console.log('will exit');
		process.exit();
	});
