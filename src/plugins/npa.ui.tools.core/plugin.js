/*
 * plugin.js - Core plugin for NPA UI Tools
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const UIPlugin = require('../../npaUtil.js');

var plugin = new UIPlugin();

plugin.helloRequestHandler = function(req,res){
	plugin.debug('->helloRequestHandler');
	res.set('Content-Type','application/json');
	plugin.debug('<-helloRequestHandler');
	res.json({"status": 200,"message": "ok","data": "Hello, World! (from NPA UI Tools)"});
}

module.exports = plugin;