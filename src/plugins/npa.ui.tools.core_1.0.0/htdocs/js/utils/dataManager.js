/*
 * dataManager.js - NPA UI Tools Core component framework's DataManager component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
DataManagerWrapper = class {
	wrappedManager = null;
	interactionCallback = null;
	onErrorCallback = null;
	constructor(dataManager){
		this.wrappedManager = dataManager;
	}
	then(callback){
		this.interactionCallback = callback;
	}
	onError(callback){
		this.onErrorCallback = callback;
	}
}
 
npaUiCore.DataManager = class DataManager extends NpaUiComponent{
	interactionCallback = null;
	onErrorCallback = null;
	initialize(then){
		then();
	}
	render(){
	}
	query(filterExpr){
		console.log('DataManager#query()');
		let interactionConfig = this.getConfiguration().query;
		let type = 'local';
		let method = 'GET';
		let payload = {};
		if(typeof interactionConfig.type!='undefined'){
			type = interactionConfig.type;
		}
		if(typeof interactionConfig.method!='undefined'){
			method = interactionConfig.method;
		}
		if(typeof filterExpr!='undefined'){
			payload = filterExpr;
		}
		var dataManagerWrapper = new DataManagerWrapper(this);
		if('local'==type){
			//var dataManager = this;
			makeRESTCall(method,interactionConfig.uri,payload,function(response){
				if(response.status==200){
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';'
						try{
							eval(toEval);
							dataManagerWrapper.interactionCallback(data);
						}catch(t){
							if(dataManagerWrapper.onErrorCallback!=null){
								dataManagerWrapper.onErrorCallback('dataManager.js#query() - exception evaluating adapter');
							}
						}
					}else{
						dataManagerWrapper.interactionCallback(response);
					}
				}else{
					if(dataManagerWrapper.onErrorCallback!=null){
						dataManagerWrapper.onErrorCallback(response.message);
					}
				}
			},function(errorMsg){
				if(dataManagerWrapper.onErrorCallback!=null){
					dataManagerWrapper.onErrorCallback(errorMsg);
				}else{
					console.log(errorMsg);
				}
			});
		}
		return dataManagerWrapper;
	}
	create(record){
		console.log('DataManager#create()');
		let interactionConfig = this.getConfiguration().create;
		let type = 'local';
		let method = 'POST';
		let payload = record;
		if(typeof interactionConfig.type!='undefined'){
			type = interactionConfig.type;
		}
		if(typeof interactionConfig.method!='undefined'){
			method = interactionConfig.method;
		}
		if('local'==type){
			var dataManager = this;
			makeRESTCall(method,interactionConfig.uri,payload,function(response){
				if(response.status==200){
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';'
						try{
							eval(toEval);
							dataManager.interactionCallback(data);
						}catch(t){
							if(dataManager.onErrorCallback!=null){
								dataManager.onErrorCallback('dataManager.js#create() - exception evaluating adapter');
							}
						}
					}else{
						dataManager.interactionCallback(response);
					}
				}else{
					if(dataManager.onErrorCallback!=null){
						dataManager.onErrorCallback(response.message);
					}
				}
			},function(errorMsg){
				if(dataManager.onErrorCallback!=null){
					dataManager.onErrorCallback(errorMsg);
				}else{
					console.log(errorMsg);
				}
			});
		}
		return this;
	}
	then(callback){
		this.interactionCallback = callback;
	}
	onError(callback){
		this.onErrorCallback = callback;
	}
}