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

function makeRESTCall(action,uri,params,onSuccess,onError){
	$.ajax(
	   {
	      url        : uri,
	      type       : action,
	      dataType   : 'json',
	      contentType: 'application/json',
	      success    : function(){},
	      data       : (action=='POST' || action=='PUT')?JSON.stringify(params):null
	   }
	)
	.done(function (response) {
		onSuccess(response);
	})
	.fail(function(jqXHR, textStatus) {
		console.log('makeRESTCall#fail() textStatus='+textStatus);
		var errorMsg = jqXHR.responseText;
		if(jqXHR.status!=200){
			errorMsg = jqXHR.statusText;
		}
		if(onError){
			onError({"message": errorMsg,"httpStatus": jqXHR.status});
		}else{
			if(showError){
				showError('Error invoking "'+uri+'": '+errorMsg);
			}else{
				console.log('Error invoking "'+uri+'": '+errorMsg);
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
	parentDivId = null;
	constructor(parentDivId,configuration){
		this.parentDivId = parentDivId;
		this.config = configuration;
	}
	getId(){
		return this.config.id;
	}
	getConfiguration(){
		return this.config.configuration;
	}
	parentDiv(){
		return $('#'+this.parentDivId);
	}
	initialize(then){
		if(then){
			then();
		}
	}
	render(){
		console.log('NpaUiComponent#render() was called');
	}
}

class NpaUiComponentProxy {
	constructor(namespace,type,id,configuration){
		let instance = null;
		let toEval = 'instance = new '+namespace+'.'+type+'(id,configuration);';
		eval(toEval);
		return instance;
	}
}

// default namespace declaration
npaUiCore = {}

npaUi = {
	globalConfig: null,
	componentInstances: {},
	componentByDivId: {},
	actionHandlers: {},
	selectionListeners: {},
	loadingComponent: 0,
    render: function(){
		this.loadingComponent = $('.npaUi').length;
		$('.npaUi').each(function(index,element){
			let c = $(this);
			var divId = c.attr('id');
            console.log('rendering component #'+divId);
            let cachedComponent = npaUi.componentByDivId[divId];
            if(typeof cachedComponent=='undefined'){
				console.log('no cached component found. Loading configuration...');
	            let configFileUri = c.data('config');
	            if(configFileUri){
	            	console.log('configuration file: '+configFileUri);
		            $.loadJson(configFileUri,function(json){
						console.log(json);
						npaUi.loadComponent(json.type,json.version,function(namespace,type){
							console.log('creating new instance of the '+type+' component from namespace '+namespace);
							npaUi.componentInstances[json.id] = new NpaUiComponentProxy(namespace,type,divId,json);
							npaUi.componentByDivId[divId] = npaUi.componentInstances[json.id];
							npaUi.componentInstances[json.id].initialize(function(){
								npaUi.loadingComponent--;
								console.log('first rendering for component '+type+' from namespace '+namespace);
								npaUi.componentInstances[json.id].render();
								$('#'+divId).data('loaded','true');
								if(npaUi.loadingComponent==0){
									npaUi.onComponentLoaded();
								}
							});
							
						});
					});
				}else{
					console.log('no local configuration file detected - looking for a reference in globalConfig');
					let ref = c.data('ref');
					if(ref){
						let globalComponentDef = npaUi.globalConfig.components[ref];
						if(globalComponentDef){
							npaUi.loadComponent(globalComponentDef.type,globalComponentDef.version,function(namespace,type){
								console.log('creating new instance of the '+type+' component from namespace '+namespace);
								npaUi.componentInstances[globalComponentDef.id] = new NpaUiComponentProxy(namespace,type,divId,globalComponentDef);
								npaUi.componentByDivId[divId] = npaUi.componentInstances[globalComponentDef.id];
								npaUi.componentInstances[globalComponentDef.id].initialize(function(){
									npaUi.loadingComponent--;
									console.log('first rendering for component '+type+' from namespace '+namespace);
									npaUi.componentInstances[globalComponentDef.id].render();
									$('#'+divId).data('loaded','true');
									if(npaUi.loadingComponent==0){
										npaUi.onComponentLoaded();
									}
								});
								
							});
						}else{
							console.log('no component found in global configuration from reference '+ref+' - skipping...');
							npaUi.loadingComponent--;
						}
					}else{
						console.log('no configuration file nor global configuration reference found - skipping...');
						npaUi.loadingComponent--;
					}
				}
			}else{
				npaUi.loadingComponent--;
				cachedComponent.render();
				if(npaUi.loadingComponent==0){
					npaUi.onComponentLoaded();
				}
			}
        });
    },
    loadConfigFrom: function(configFileUri,then){
		$.loadJson(configFileUri,function(json){
			npaUi.globalConfig = json;
			then();
		});
	},
	getComponent: function(componentId){
		return npaUi.componentInstances[componentId];
	},
    loadComponent: function(componentType,version,then){
		let namespace = 'npaUiCore';
		let type = componentType;
		if(componentType.indexOf('.')>0){
			let tokens = componentType.split('.');
			namespace = tokens[0];
			type = tokens[1];
		}
		let componentDef = this.componentMap[namespace][type];
		if(typeof componentDef!='undefined'){
			if(componentDef.loaded){
				then(namespace,type);
			}else{
				console.log('component '+componentType+' not in cache - loading...');
				$.loadScript(componentDef.dependency,function(){
					componentDef.loaded = true;
					then(namespace,type);
				});
			}
		}else{
			console.log('NPA UI - undefined Component type '+componentType);
		}
	},
    initialize: function(then){
		var deps = [
			{"type": "css","uri": "/uiTools/css/npaUiTheme.css"}
		];
		loadDeps(deps,function(){
			makeRESTCall('GET','/uiToolsApis/getComponentMap',{},function(response){
				npaUi.componentMap = response.data;
				then();
			},function(){
				console.error('NPA-UI was unable to load the Component Map from server!');
			});
		});
	},
	onComponentLoaded: function(){
		console.log('NPA UI runtime: all components loaded!');
	},
	registerActionHandler: function(actionId,handler){
		this.actionHandlers[actionId] = handler;
	},
	registerSelectionListener: function(source,listener){
		let listeners = this.selectionListeners[source];
		if(typeof listeners=='undefined'){
			this.selectionListeners[source] = [];
			listeners = this.selectionListeners[source];
		}
		listeners.push(listener);
	},
	fireEvent: function(actionId,event){
		console.log('fireEvent('+actionId+')');
		console.log(event);
		if('select'==actionId){
			let listeners = this.selectionListeners[event.source];
			if(listeners && listeners.length>0){
				for(var i=0;i<listeners.length;i++){
					let listener = listeners[i];
					try{
						listener.onItemSelected(event.item);
					}catch(t){}
				}
			}
		}else{
			let handler = this.actionHandlers[actionId];
			if(typeof handler!='undefined'){
				try{
					handler.handleEvent(event);
				}catch(t){
					console.log(t);
				}
			}
		}
	}
}