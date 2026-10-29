/*
 * plugin.js - NPA UI Tools Icon Picker plugin
 * Copyright 2026 Nicolas Renaudet - All rights reserved
 */

const UIPlugin = require('../../npaUtil.js');
const fs = require('fs');
const path = require('path');

const STATIC_EXTENSION_ID = 'npa.ui.icon.picker.htdocs';
const IMG_SUBDIR = 'img';
const ICON_EXTENSIONS = ['.png','.gif','.jpg','.jpeg','.svg','.ico','.webp'];

var plugin = new UIPlugin();

/*
 * Converts a relative path ("silk/sub") to the public URI of the corresponding resource
 */
plugin.toUri = function(relativePath){
	let staticPath = this.getExtensionById(STATIC_EXTENSION_ID).path;
	let segments = relativePath.split('/').filter(function(s){ return s.length>0; }).map(encodeURIComponent);
	return staticPath+'/'+IMG_SUBDIR+(segments.length>0?'/'+segments.join('/'):'');
}

/*
 * Normalizes a client-provided relative folder path. Returns null if the path tries to escape the img directory.
 */
plugin.sanitizeRelativePath = function(rawPath){
	if(typeof rawPath!='string'){
		return '';
	}
	let segments = rawPath.split(/[\\\/]+/).filter(function(s){ return s.length>0; });
	for(var i=0;i<segments.length;i++){
		if('..'==segments[i] || '.'==segments[i] || segments[i].indexOf(':')>=0){
			return null;
		}
	}
	return segments.join('/');
}

/*
 * GET /icons?path=<relative folder>
 * Dynamically lists the sub-folders and the icon files located in htdocs/img/<path>
 */
plugin.getIconsHandler = function(req,res){
	plugin.debug('->getIconsHandler()');
	res.set('Content-Type','application/json');
	let relativePath = plugin.sanitizeRelativePath(req.query.path);
	if(relativePath==null){
		res.json({"status": 400,"message": "invalid path","data": {}});
		return;
	}
	let baseDir = path.join(plugin.getLocalDirectory(),'htdocs',IMG_SUBDIR);
	let targetDir = path.join(baseDir,relativePath);
	if(targetDir!=baseDir && !targetDir.startsWith(baseDir+path.sep)){
		res.json({"status": 400,"message": "invalid path","data": {}});
		return;
	}
	fs.readdir(targetDir,{withFileTypes: true},function(err,entries){
		if(err){
			plugin.error('getIconsHandler() unable to read '+targetDir+': '+err.message);
			res.json({"status": 404,"message": "folder not found","data": {}});
			return;
		}
		let folders = [];
		let icons = [];
		entries.forEach(function(entry){
			let entryPath = relativePath.length>0?relativePath+'/'+entry.name:entry.name;
			if(entry.isDirectory()){
				folders.push({"name": entry.name,"path": entryPath});
			}else if(entry.isFile() && ICON_EXTENSIONS.indexOf(path.extname(entry.name).toLowerCase())>=0){
				icons.push({"name": entry.name,"path": entryPath,"uri": plugin.toUri(entryPath)});
			}
		});
		const byName = function(a,b){ return a.name.localeCompare(b.name); };
		folders.sort(byName);
		icons.sort(byName);
		let parent = null;
		if(relativePath.length>0){
			let idx = relativePath.lastIndexOf('/');
			parent = idx>=0?relativePath.substring(0,idx):'';
		}
		plugin.debug('<-getIconsHandler()');
		res.json({"status": 200,"message": "ok","data": {"path": relativePath,"parent": parent,"folders": folders,"icons": icons}});
	});
}

module.exports = plugin;
