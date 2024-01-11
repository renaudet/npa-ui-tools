/*
 * plugin.js - Core plugin for NPA UI Tools
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const UIPlugin = require('../../npaUtil.js');
const DEFAULT_NAMESPACE = 'npaUiCore';

var plugin = new UIPlugin();
plugin.compMap = {};

plugin.beforeExtensionPlugged = function(){
	const baseMap = require('./coreComponentMap.json');
	this.compMap[DEFAULT_NAMESPACE] = {};
	Object.assign(this.compMap[DEFAULT_NAMESPACE],baseMap);
	//console.log(this.compMap);
}

plugin.lazzyPlug = function(extenderId,extensionPointConfig){
	if('npa.ui.tools.core.component'==extensionPointConfig.point){
		this.info('plugin in UI component "'+extensionPointConfig.namespace+':'+extensionPointConfig.name+'"');
		if(typeof this.compMap[extensionPointConfig.namespace]=='undefined'){
			this.compMap[extensionPointConfig.namespace] = {};
		}
		this.compMap[extensionPointConfig.namespace][extensionPointConfig.name] = {"version": extensionPointConfig.version,"dependency": extensionPointConfig.dependency};
	}
}

plugin.getComponentMapHandler = function(req,res){
	plugin.debug('->getComponentMapHandler');
	res.set('Content-Type','application/json');
	plugin.debug('<-getComponentMapHandler');
	res.json({"status": 200,"message": "ok","data": plugin.compMap});
}

module.exports = plugin;