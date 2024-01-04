/*
 * plugin.js - Test application plugin for NPA
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const Plugin = require('../../npaUtil.js');
const ENV_NAME = 'APPLICATION_NAME';
const ENV_APPLICATION_PORT = 'APPLICATION_PORT';
const DS_REFERENCE = 'test-ds';

var plugin = new Plugin();

plugin.initialize = function(){
	this.name = process.env[ENV_NAME];
	this.info('Application '+this.name+' starting...');
	var httpServer = this.getService('http');
	if(typeof process.env[ENV_APPLICATION_PORT]!='undefined'){
		httpServer.startListener(process.env[ENV_APPLICATION_PORT]);
	}else{
		httpServer.startListener();
	}
}

plugin.getRecordsHandler = function(req,res){
	plugin.debug('->getRecordsHandler');
	res.set('Content-Type','application/json');
	let couch = plugin.getService('couchdb');
	let query = {"selector": {}};
	if(req.body && req.body.selector){
		query = req.body;
	}
	couch.query(DS_REFERENCE,query,function(err,data){
		plugin.debug('<-getRecordsHandler');
		if(err){
			res.json({"status": 500,"message": "Data access error","data": err});
		}else{
			res.json({"status": 200,"message": "ok","data": data});
		}
	});
}

plugin.createRecordHandler = function(req,res){
	plugin.debug('->createRecordHandler');
	res.set('Content-Type','application/json');
	let couch = plugin.getService('couchdb');
	couch.createRecord(DS_REFERENCE,req.body,function(err,data){
		plugin.debug('<-createRecordHandler');
		if(err){
			res.json({"status": 500,"message": "Error creating new record","data": err});
		}else{
			res.json({"status": 200,"message": "ok","data": data});
		}
	});
}

module.exports = plugin;