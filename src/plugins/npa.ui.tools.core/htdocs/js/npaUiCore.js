/*
 * npaUiCore.js - NPA UI Tools Core component framework
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */

jQuery.loadScript = function (uri, callback){
	$.ajax({
        url: uri,
        dataType: "script",
        success: function(){},
        async: true
    }).done(function(data){
		callback(data);
	});
}

jQuery.loadJson = function (uri, callback){
	$.ajax({
        url: uri,
        dataType: "json",
        success: function(){},
        async: true
    }).done(function(json){
		callback(json);
	});
}

jQuery.loadCss = function (cssUrl, callback){
	$.ajax({
        url: cssUrl,
        dataType: 'text',
        async: true,
        success: function(){
			$("head").append("<link>");
            let css = $("head").children(":last");
            css.attr({
                rel: "stylesheet",
                type: "text/css",
                href: cssUrl
            });
            if(callback){
				callback();
			}
		}
    });
}

function loadDeps(depArray,then){
	var jsonResources = [];
	var internalLoadDep = function(depLst,index,onceDone){
		if(index<depLst.length){
			var dep = depLst[index];
			if('library'==dep.type || 'js'==dep.type){
				$.loadScript(dep.uri,function(){
					internalLoadDep(depLst,index+1,onceDone);
				});
			}else
			if('stylesheet'==dep.type || 'css'==dep.type){
				$.loadCss(dep.uri,function(){
					internalLoadDep(depLst,index+1,onceDone);
				});
			}else
			if('json'==dep.type){
				$.loadJson(dep.uri,function(json){
					jsonResources.push(json);
					internalLoadDep(depLst,index+1,onceDone);
				});
			}else{
				// not supported
				console.log('npaUiCore#loadDep: unsupported dependency type '+dep.type);
				internalLoadDep(depLst,index+1,onceDone);
			}
		}else{
			onceDone();
		}
	}
	internalLoadDep(depArray,0,function(){
		then(jsonResources);
	});
}

class NpaUiComponent {
	config = null;
	id = null;
	constructor(id,configuration){
		this.id = id;
		this.config = configuration;
	}
	render(){
		console.log('NpaUiComponent#render() was called');
	}
}

class NpaUiComponentProxy {
	constructor(id,configuration){
		let instance = null;
		let toEval = 'instance = new '+configuration.type+'(id,configuration);';
		eval(toEval);
		return instance;
	}
}

npaUi = {
	componentCache: {},
	componentInstances: {},
	loadingComponent: 0,
    render: function(){
        $('.npaUi').each(function(){
			npaUi.loadingComponent++;
            let c = $(this);
            console.log('rendering component #'+c.attr('id'));
            let configFileUri = c.data('config');
            console.log('configuration file: '+configFileUri);
            $.loadJson(configFileUri,function(json){
				console.log(json);
				let cachedComponent = npaUi.componentCache[json.type];
				if(typeof cachedComponent!='undefined'){
					npaUi.loadingComponent--;
					npaUi.componentInstances[json.id] = new NpaUiComponentProxy(c.attr('id'),json);
					npaUi.componentInstances[json.id].render();
				}else{
					npaUi.loadComponent(json.type,json.version,function(){
						npaUi.componentInstances[json.id] = new NpaUiComponentProxy(c.attr('id'),json);
						npaUi.componentInstances[json.id].render();
						if(npaUi.loadingComponent==0){
							npaUi.onComponentLoaded();
						}
					});
				}
			});
        });
    },
    loadComponent: function(componentType,version,then){
		let componentDef = this.componentMap[componentType];
		if(typeof componentDef!='undefined'){
			$.loadScript(componentDef.dependency,function(){
				npaUi.loadingComponent--;
				npaUi.componentCache[componentType] = componentType;
				then();
			});
		}else{
			npaUi.loadingComponent--;
			console.log('NPA UI Component type '+componentType+' not known!');
		}
	},
    initialize: function(then){
		var deps = [
			{"type": "css","uri": "/uiTools/css/npaUiTheme.css"},
			{"type": "json","uri": "/uiTools/js/components/componentMap.json"}
		];
		loadDeps(deps,function(jsonResources){
			if(jsonResources && jsonResources.length>0){
				npaUi.componentMap = jsonResources[0];
			}else{
				npaUi.componentMap = {};
			}
			then();
		});
	},
	onComponentLoaded: function(){
		console.log('NPA UI runtime: all components loaded!');
	}
}