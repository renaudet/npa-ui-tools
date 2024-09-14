/*
 * plugin.js - Core plugin for NPA UI Tools
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const UIPlugin = require('../../npaUtil.js');
const DEFAULT_NAMESPACE = 'npaUiCore';

var plugin = new UIPlugin();
plugin.compMap = {};
plugin.registeredEditors = [];

plugin.beforeExtensionPlugged = function(){
	const baseMap = require('./coreComponentMap.json');
	this.compMap[DEFAULT_NAMESPACE] = {};
	Object.assign(this.compMap[DEFAULT_NAMESPACE],baseMap);
}

plugin.lazzyPlug = function(extenderId,extensionPointConfig){
	if('npa.ui.tools.core.component'==extensionPointConfig.point){
		this.info('plugin in UI component "'+extensionPointConfig.namespace+':'+extensionPointConfig.name+'"');
		if(typeof this.compMap[extensionPointConfig.namespace]=='undefined'){
			this.compMap[extensionPointConfig.namespace] = {};
		}
		this.compMap[extensionPointConfig.namespace][extensionPointConfig.name] = {"version": extensionPointConfig.version,"dependency": extensionPointConfig.dependency};
	}
	if('npa.ui.tools.core.editor'==extensionPointConfig.point){
		this.info('plugin in Specialized Editor for datatype "'+extensionPointConfig.datatype+'" from plugin '+extenderId);
		plugin.registeredEditors.push(extensionPointConfig);
	}
}

plugin.getComponentMapHandler = function(req,res){
	plugin.debug('->getComponentMapHandler');
	res.set('Content-Type','application/json');
	plugin.debug('<-getComponentMapHandler');
	res.json({"status": 200,"message": "ok","data": plugin.compMap});
}

plugin.getEditorExtensionsHandler= function(req,res){
	plugin.debug('->getEditorExtensionsHandler');
	res.set('Content-Type','application/json');
	plugin.debug('<-getEditorExtensionsHandler');
	res.json({"status": 200,"message": "ok","data": plugin.registeredEditors});
}

module.exports = plugin;