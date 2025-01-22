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
		if(callback){
			callback(data);
		}
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
	if(attributeName.length>0){
		if(list.length>1){
			for(var i=0;i<list.length-1;i++){
				for(var j=i+1;j<list.length;j++){
					var listi = list[i];
					var listj = list[j];
					if(typeof listj[attributeName]!='undefined' && typeof listi[attributeName]!='undefined'){
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
					}
				}
			}
		}
	}else{
		if(list.length>1){
			for(var i=0;i<list.length-1;i++){
				for(var j=i+1;j<list.length;j++){
					var listi = list[i];
					var listj = list[j];
					if(typeof listj!='undefined' && typeof listi!='undefined'){
						if(Number.isInteger(listj)){
							if(descending){
								if(listj<listi){
									var tmp = listi;
									list[i] = listj;
									list[j] = tmp;
								}
							}else{
								if(listj>listi){
									var tmp = listi;
									list[i] = listj;
									list[j] = tmp;
								}
							}
						}else{
							if(descending){
								if(listj.localeCompare(listi)<0){
									var tmp = listi;
									list[i] = listj;
									list[j] = tmp;
								}
							}else{
								if(listj.localeCompare(listi)>0){
									var tmp = listi;
									list[i] = listj;
									list[j] = tmp;
								}
							}
						}
					}
				}
			}
		}
	}
	return list;
}

// default namespace declaration
npaUiCore = {}

npaUi = {
	globalConfig: {},
	componentInstances: {},
	componentByDivId: {},
	actionHandlers: {},
	selectionListeners: {},
	localizationMap: null,
    render: function(targetClass='npaUi'){
		let toLoad = [];
		console.log('npaUi#render('+targetClass+')');
		$('.'+targetClass).each(function(index,element){
			let placeholder = $(this);
			var divId = placeholder.attr('id');
            let cachedComponent = npaUi.componentByDivId[divId];
            if(typeof cachedComponent=='undefined'){
				toLoad.push(placeholder);
			}else{
				cachedComponent.render();
			}
		});
		if(toLoad.length>0){
			let loadInstances = function(placeHolderList,index){
				if(index<placeHolderList.length){
					let placeholder = placeHolderList[index];
					npaUi.loadSingleInstance(placeholder,null,function(){
						loadInstances(placeHolderList,index+1);
					});
				}else{
					npaUi.onRenderingCompleted();
				}
			}
			loadInstances(toLoad,0);
		}else{
			npaUi.onRenderingCompleted();
		}		
    },
    loadSingleInstance: function(parentDiv,config,then){
		let divId = parentDiv.attr('id');
		console.log('processing Tag '+divId);
		if(config!=null){
			console.log('a specific configuration was provided:');
			console.log(config);
			this.loadComponent(config.type,config.version,function(namespace,type){
				console.log('(dynamic JSON) creating new instance of the '+type+' component from namespace '+namespace);
				npaUi.componentInstances[config.id] = new NpaUiComponentProxy(namespace,type,divId,config);
				npaUi.componentByDivId[divId] = npaUi.componentInstances[config.id];
				npaUi.componentInstances[config.id].initialize(function(){
					console.log('first rendering for component #'+config.id+' of type '+type+' from namespace '+namespace);
					npaUi.componentInstances[config.id].render();
					$('#'+divId).data('loaded','true');
					if(config.configuration.selectionListener && config.configuration.selectionProvider){
						npaUi.registerSelectionListener(config.configuration.selectionProvider,npaUi.componentInstances[config.id]);
					}
					then();
				});
				
			});
		}else{
			let configFileUri = parentDiv.data('config');
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
							console.log('first rendering for component '+type+' from namespace '+namespace);
							npaUi.componentInstances[json.id].render();
							$('#'+divId).data('loaded','true');
							if(json.configuration.selectionListener && json.configuration.selectionProvider){
								npaUi.registerSelectionListener(json.configuration.selectionProvider,npaUi.componentInstances[json.id]);
							}
							then();
						});
						
					});
				});
				
			}else{
				let ref = parentDiv.data('ref');
				if(ref){
					console.log('tag defines a global reference: '+ref);
					let globalComponentDef = npaUi.globalConfig.components[ref];
					if(globalComponentDef){
						
						npaUi.loadComponent(globalComponentDef.type,globalComponentDef.version,function(namespace,type){
							console.log('(global configuration) creating new instance of the '+type+' component from namespace '+namespace);
							npaUi.componentInstances[globalComponentDef.id] = new NpaUiComponentProxy(namespace,type,divId,globalComponentDef);
							npaUi.componentByDivId[divId] = npaUi.componentInstances[globalComponentDef.id];
							npaUi.componentInstances[globalComponentDef.id].initialize(function(){
								console.log('first rendering for component '+type+' from namespace '+namespace);
								npaUi.componentInstances[globalComponentDef.id].render();
								$('#'+divId).data('loaded','true');
								if(globalComponentDef.configuration.selectionListener && globalComponentDef.configuration.selectionProvider){
									npaUi.registerSelectionListener(globalComponentDef.configuration.selectionProvider,npaUi.componentInstances[globalComponentDef.id]);
								}
								then();
							});
							
						});
						
					}else{
						console.log('can\'t resolve global reference - skipping...');
						then();
					}
				}else{
					console.log('no global reference nor configuration file URI found in Tag - skipping...');
					then();
				}
			}
		}
	},
	clearComponentCacheByDivId: function(tagId){
		delete this.componentByDivId[tagId];
	},
    renderSingleComponent: function(tagId,componentConfig,then){
		let placeholder = $('#'+tagId);
		let cachedComponent = npaUi.componentByDivId[tagId];
        if(typeof cachedComponent=='undefined'){
			this.loadSingleInstance(placeholder,componentConfig,function(){
				console.log('npaUiCore#renderSingleComponent() returned');
				then();
			});
		}else{
			cachedComponent.render();
			then();
		}
	},
    loadConfigFrom: function(configFileUri,then){
		$.loadJson(configFileUri,function(json){
			//npaUi.globalConfig = json;
			Object.assign(npaUi.globalConfig,json);
			then();
		});
	},
	registerComponentConfig: function(reference,componentConfig){
		this.globalConfig.components[reference] = componentConfig;
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
			console.log(this.componentMap);
		}
	},
	unLoad: function(componentId){
		let proxy = this.componentInstances[componentId];
		if(typeof proxy!='undefined'){
			let divId = proxy.parentDivId;
			delete this.componentInstances[componentId];
			delete this.componentByDivId[divId];
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
	localizeTags: function(){
		let framwk = this;
		$('var').each(function(index,element){
			let varTag = $(this);
			let localizedString = framwk.getLocalizedString('@'+varTag.text());
			varTag.html(localizedString);
		});
	},
	onRenderingCompleted: function(){
		this.localizeTags();
		this.onComponentLoaded();
		$(window).trigger('resize');
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
		console.log('npaUiCore#fireEvent('+actionId+') - event:');
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
				if(typeof event.newWindow!='undefined' && event.newWindow){
					let windowId = 'apaf_'+Math.floor(Math.random()*1000000);
					window.open(event.uri,'apaf_'+windowId);
				}else{
					window.location.assign(event.uri);
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
			}else{
				console.log('no action handler registered for this event');
			}
		}
	},
	getLocalizedString: function(stringExpr,data){
		if(typeof stringExpr!='undefined' && stringExpr!=null){
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
				if(stringExpr.startsWith('#')){
					let id = stringExpr.replace(/#/,'');
					return '<span id="'+id+'">'+id+'</span>';
				}else
					return stringExpr;
			}
		}else{
			return '!';
		}
	}
}