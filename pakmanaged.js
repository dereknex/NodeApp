var global = Function("return this;")();
/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);
// pakmanager:nodeapp/lib/nodeapp.js
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
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
    
    
  provide("nodeapp/lib/nodeapp.js", module.exports);
}(global));

// pakmanager:nodeapp
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  module.exports =  require('nodeapp/lib/nodeapp.js');
  provide("nodeapp", module.exports);
}(global));