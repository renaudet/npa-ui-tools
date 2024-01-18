/*
 * plugin.js - Localization plugin for NPA UI Tools
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
const UIPlugin = require('../../npaUtil.js');
const fs = require("fs");
const DEFAULT_LOCALE = 'en-US';

var plugin = new UIPlugin();
plugin.defaultLocale = DEFAULT_LOCALE;
plugin.providers = {};

plugin.beforeExtensionPlugged = function(){
}

plugin.lazzyPlug = function(extenderId,extensionPointConfig){
	if('npa.ui.locale.provider'==extensionPointConfig.point){
		this.info('adding Locale provider '+extenderId+':'+extensionPointConfig.id+' for language(s) '+extensionPointConfig.locale);
		try{
			this.info('before this.runtime.getPluginWrapper()');
			let contributorPlugin = this.runtime.getPluginWrapper(extenderId);
			console.log('contributorPlugin: ');
			console.log(contributorPlugin);
			let localeFilePath = contributorPlugin.getLocalDirectory()+'/'+extensionPointConfig.path;
			this.info('local file path: '+localeFilePath);
			this.loadLocalizationFile(localeFilePath,extensionPointConfig.locale);
		}catch(e){
			this.info('error!');
			console.log(e);
		}
	}
}

plugin.loadLocalizationFile = function(filePath,locale){
	this.info('->loadLocalizationFile()');
	let normalizedLocale = locale.toLowerCase();
	var fileContent = fs.readFileSync(filePath, 'utf8');
	let provider = this.providers[normalizedLocale];
	if(typeof provider=='undefined'){
		provider = {};
		this.providers[normalizedLocale] = provider;
	}
	let lines = fileContent.split('\r\n');
	for(var i=0;i<lines.length;i++){
		let line = lines[i].trim();
		if(line.length>0 && !line.startsWith('#')){
			let token = line.split('=');
			provider[token[0]] = token[1];
		}
	}
	this.info('<-loadLocalizationFile()');
}

plugin.setDefaultLocale = function(locale){
	this.defaultLocale = locale;
}

plugin.getProvider = function(locale){
	if('default'==locale){
		return this.providers[this.defaultLocale];
	}else{
		let provider = this.providers[locale];
		if(typeof provider!='undefined'){
			return provider;
		}else
			return this.providers[this.defaultLocale];
	}
}

plugin.localize = function(reference,textArray=[],locale=DEFAULT_LOCALE){
	let normalizedLocale = locale.toLowerCase();
	let provider = this.getProvider(normalizedLocale);
	let expr = reference;
	if(typeof provider!='undefined' && typeof provider[reference]){
		expr = provider[reference];
	}
	//console.log('plugin.localize(): expr='+expr);
	for(var i=0;i<textArray.length;i++){
		//console.log('plugin.localize(): i='+i);
		let regexExpr = '\\{'+i+'\\}';
		//console.log('plugin.localize(): regexExpr='+regexExpr);
		var regex = new RegExp(regexExpr,'g');
		//console.log('plugin.localize(): value[i]='+textArray[i]);
		expr = expr.replace(regex,textArray[i]);
	}
	return expr;
}

plugin.localizeQueryHandler = function(req,res){
	let ref = req.query.ref;//mandatory
	let values = req.query.values;//optional
	let locale = req.query.locale;//optional default-value='default'
	let inserts = [];
	if(typeof values!='undefined' && values!=null && values.length>0){
		inserts = values.split(',');
	}
	try{
		let i18nStr = plugin.localize(ref,inserts,locale);
		res.json({"text": i18nStr});
	}catch(e){
		console.log(e);
		res.send(JSON.stringify(e));
	}
}

plugin.getLocalizationMapHandler = function(req,res){
	let locale = req.query.locale;
	if(typeof locale=='undefined'){
		locale = DEFAULT_LOCALE;
	}
	let normalizedLocale = locale.toLowerCase();
	let provider = plugin.getProvider(normalizedLocale);
	res.json(provider);
}

module.exports = plugin;