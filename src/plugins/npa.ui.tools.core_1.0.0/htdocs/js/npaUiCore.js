/*
 * npaUiCore.js - NPA UI Tools Core component framework
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */

$(document)
  .ajaxStart(function () {
	$('.spinner-border').removeClass('visually-hidden');
  })
  .ajaxStop(function () {
	setTimeout(function(){ $('.spinner-border').addClass('visually-hidden'); },200);
  })
  .ajaxError(function () {
	$('.spinner-border').addClass('visually-hidden');
});

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
			console.log('Error invoking "'+uri+'": '+errorMsg);
		}
	});
}

function loadDeps(depArray,then){
	var jsonResources = [];
	var internalLoadDep = function(depLst,index,onceDone){
		if(index<depLst.length){
			var dep = depLst[index];
			if('js'==dep.type || 'library'==dep.type || 'javascript'==dep.type){
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

function sortOn(list,attributeName,descending=true){
	if(typeof attributeName=='undefined'){
		console.log('sortOn('+attributeName+')');
		console.trace();
	}
	if(list.length>1){
		for(var i=0;i<list.length-1;i++){
			for(var j=i+1;j<list.length;j++){
				var listi = list[i];
				var listj = list[j];
				if(listj[attributeName] || listj[attributeName]==0){
					if(Number.isInteger(listj[attributeName])){
						if(listj[attributeName]<listi[attributeName]){
							var tmp = listi;
							list[i] = listj;
							list[j] = tmp;
						}
					}else{
						if(descending){
							if(listj[attributeName].localeCompare(listi[attributeName])<0){
								var tmp = listi;
								list[i] = listj;
								list[j] = tmp;
							}
						}else{
							if(listj[attributeName].localeCompare(listi[attributeName])>0){
								var tmp = listi;
								list[i] = listj;
								list[j] = tmp;
							}
						}
					}
				}else{
					console.log('sortOn(): invalid listj');
					console.log(listj);
				}
			}
		}
	}
	return list;
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
	localizationMap: null,
    render: function(){
		this.loadingComponent = $('.npaUi').length;
		console.log('number of component to render: '+this.loadingComponent);
		let toLoad = [];
		$('.npaUi').each(function(index,element){
			let placeholder = $(this);
			var divId = placeholder.attr('id');
            //console.log('rendering component #'+divId);
            let cachedComponent = npaUi.componentByDivId[divId];
            if(typeof cachedComponent=='undefined'){
				toLoad.push(placeholder);
			}else{
				cachedComponent.render();
			}
		});
		if(toLoad.length>0){
			let loadInstance = function(placeHolderList,index){
				if(index<placeHolderList.length){
					let placeholder = placeHolderList[index];
					let divId = placeholder.attr('id');
					console.log('processing Tag '+divId);
					let configFileUri = placeholder.data('config');
					if(configFileUri){
						console.log('tag defines a JSON file uri: '+configFileUri);
						
						$.loadJson(configFileUri,function(json){
							console.log('tag configuration file loaded:');
							console.log(json);
							npaUi.loadComponent(json.type,json.version,function(namespace,type){
								console.log('(specific JSON) creating new instance of the '+type+' component from namespace '+namespace);
								npaUi.componentInstances[json.id] = new NpaUiComponentProxy(namespace,type,divId,json);
								npaUi.componentByDivId[divId] = npaUi.componentInstances[json.id];
								npaUi.componentInstances[json.id].initialize(function(){
									//npaUi.loadingComponent--;
									console.log('first rendering for component '+type+' from namespace '+namespace);
									npaUi.componentInstances[json.id].render();
									$('#'+divId).data('loaded','true');
									/*if(npaUi.loadingComponent==0){
										npaUi.onComponentLoaded();
									}*/
									if(json.configuration.selectionListener && json.configuration.selectionProvider){
										npaUi.registerSelectionListener(json.configuration.selectionProvider,npaUi.componentInstances[json.id]);
									}
									loadInstance(placeHolderList,index+1);
								});
								
							});
						});
						
					}else{
						let ref = placeholder.data('ref');
						if(ref){
							console.log('tag defines a global reference: '+ref);
							let globalComponentDef = npaUi.globalConfig.components[ref];
							if(globalComponentDef){
								
								npaUi.loadComponent(globalComponentDef.type,globalComponentDef.version,function(namespace,type){
									console.log('(global configuration) creating new instance of the '+type+' component from namespace '+namespace);
									npaUi.componentInstances[globalComponentDef.id] = new NpaUiComponentProxy(namespace,type,divId,globalComponentDef);
									npaUi.componentByDivId[divId] = npaUi.componentInstances[globalComponentDef.id];
									npaUi.componentInstances[globalComponentDef.id].initialize(function(){
										//npaUi.loadingComponent--;
										console.log('first rendering for component '+type+' from namespace '+namespace);
										npaUi.componentInstances[globalComponentDef.id].render();
										$('#'+divId).data('loaded','true');
										/*if(npaUi.loadingComponent==0){
											npaUi.onComponentLoaded();
										}*/
										if(globalComponentDef.configuration.selectionListener && globalComponentDef.configuration.selectionProvider){
											npaUi.registerSelectionListener(globalComponentDef.configuration.selectionProvider,npaUi.componentInstances[globalComponentDef.id]);
										}
										loadInstance(placeHolderList,index+1);
									});
									
								});
								
							}else{
								console.log('can\'t resolve global reference - skipping...');
								loadInstance(placeHolderList,index+1);
							}
						}else{
							console.log('no global reference nor configuration file URI found in Tag - skipping...');
							loadInstance(placeHolderList,index+1);
						}
					}
				}else{
					npaUi.onComponentLoaded();
				}
			}
			loadInstance(toLoad,0);
		}else{
			npaUi.onComponentLoaded();
		}		
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
			{"type": "css","uri": "/uiTools/css/npaUiTheme.css"},
			{"type": "js","uri": "/uiTools/js/npaUiComponentModel.js"}
		];
		loadDeps(deps,function(){
			makeRESTCall('GET','/uiToolsApis/getComponentMap',{},function(response){
				npaUi.componentMap = response.data;
				makeRESTCall('GET','/i18n/localizationMap?locale='+navigator.language,{},function(response){
					npaUi.localizationMap = response;
					then();
				},function(){
					console.error('NPA-UI was unable to load the localization file from server!');
					npaUi.localizationMap = {};
					then();
				});
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
	on: function(actionId,callback){
		let handler = {
			handleEvent: function(event){
				callback(event);
			}
		}
		this.registerActionHandler(actionId,handler);
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
		}else
		if('redirect'==actionId){
			if(typeof event.uri!='undefined'){
				window.location.assign(event.uri);
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
	},
	getLocalizedString: function(stringExpr,data){
		if(stringExpr.startsWith('@')){
			let reference = stringExpr.replace(/@/,'');
			let localizedString = reference;
			let unProcessedLocalizedString = this.localizationMap[reference];
			if(typeof unProcessedLocalizedString!='undefined'){
				if(typeof data!='undefined' && data && data.length>0){
					for(var i=0;i<data.length;i++){
						let value = data[i];
						let expr = '\\{'+i+'\\}';
						let regex = new RegExp(expr,'g');
						unProcessedLocalizedString = unProcessedLocalizedString.replace(regex,value);
					}
				}
				localizedString = unProcessedLocalizedString;
			}
			return localizedString;
		}else{
			return stringExpr;
		}
	}
}