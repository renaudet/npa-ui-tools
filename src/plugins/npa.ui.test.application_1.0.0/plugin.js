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
	// check that database exists
	let couchService = plugin.getService('couchdb');
	couchService.checkDatabase(DS_REFERENCE,function(err,exists){
		if(err){
			plugin.error('Error checking for CouchDB database '+DS_REFERENCE);
			plugin.error(JSON.stringify(err));
		}else{
			if(exists){
				var httpServer = plugin.getService('http');
				if(typeof process.env[ENV_APPLICATION_PORT]!='undefined'){
					httpServer.startListener(process.env[ENV_APPLICATION_PORT]);
				}else{
					httpServer.startListener();
				}
			}else{
				couchService.createDatabase(DS_REFERENCE,function(err,created){
					if(err){
						plugin.error('Error creating CouchDB database '+DS_REFERENCE);
						plugin.error(JSON.stringify(err));
					}else{
						var httpServer = plugin.getService('http');
						if(typeof process.env[ENV_APPLICATION_PORT]!='undefined'){
							httpServer.startListener(process.env[ENV_APPLICATION_PORT]);
						}else{
							httpServer.startListener();
						}
					}
				});
			}
		}
	});
}

plugin.getRecordsHandler = function(req,res){
	plugin.debug('->getRecordsHandler');
	res.set('Content-Type','application/json');
	let couchService = plugin.getService('couchdb');
	let query = {"selector": {}};
	if(req.body && req.body.selector){
		query = req.body;
	}
	couchService.query(DS_REFERENCE,query,function(err,data){
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
	let couchService = plugin.getService('couchdb');
	couchService.createRecord(DS_REFERENCE,req.body,function(err,data){
		plugin.debug('<-createRecordHandler');
		if(err){
			res.json({"status": 500,"message": "Error creating new record","data": err});
		}else{
			res.json({"status": 200,"message": "ok","data": data});
		}
	});
}

plugin.updateRecordHandler = function(req,res){
	plugin.debug('->updateRecordHandler');
	res.set('Content-Type','application/json');
	let couchService = plugin.getService('couchdb');
	couchService.updateRecord(DS_REFERENCE,req.body,function(err,data){
		plugin.debug('<-updateRecordHandler');
		if(err){
			res.json({"status": 500,"message": "Error updating record","data": err});
		}else{
			res.json({"status": 200,"message": "ok","data": data});
		}
	});
}

plugin.deleteRecordHandler = function(req,res){
	plugin.debug('->deleteRecordHandler');
	res.set('Content-Type','application/json');
	let couchService = plugin.getService('couchdb');
	couchService.deleteRecord(DS_REFERENCE,{"id": req.params.uuid },function(err,data){
		plugin.debug('<-deleteRecordHandler');
		if(err){
			res.json({"status": 500,"message": "Error deleting record","data": err});
		}else{
			res.json({"status": 200,"message": "deleted","data": req.params.uuid});
		}
	});
}

module.exports = plugin;