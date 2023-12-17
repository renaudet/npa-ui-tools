/*
 * plugin.js - Test application plugin for NPA
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const Plugin = require('../../npaUtil.js');
const ENV_NAME = 'APPLICATION_NAME';
const DS_REFERENCE = 'fragments';

var plugin = new Plugin();

plugin.initialize = function(){
	this.name = process.env[ENV_NAME];
	this.info('Application '+this.name+' starting...');
	var httpServer = this.getService('http');
	httpServer.startListener();
}

plugin.helloRequestHandler = function(req,res){
	plugin.debug('->helloRequestHandler');
	res.set('Content-Type','application/json');
	plugin.debug('<-helloRequestHandler');
	res.json({"status": 200,"message": "ok","data": "Hello, World! (from npa.test.application)"});
}

plugin.queryFragmentsHandler = function(req,res){
	plugin.debug('->queryFragmentsHandler');
	res.set('Content-Type','application/json');
	let couch = plugin.getService('couchdb');
	let query = {"selector": {}};
	if(req.body && req.body.selector){
		query = req.body;
	}
	couch.query(DS_REFERENCE,query,function(err,data){
		plugin.debug('<-queryFragmentsHandler');
		if(err){
			res.json({"status": 500,"message": "Data access error","data": err});
		}else{
			res.json({"status": 200,"message": "ok","data": data});
		}
	});
}

module.exports = plugin;