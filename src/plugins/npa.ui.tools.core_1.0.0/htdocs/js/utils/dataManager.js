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
		return this;
	}
	onError(callback){
		this.onErrorCallback = callback;
		return this;
	}
}
 
npaUiCore.DataManager = class DataManager extends NpaUiComponent{
	initialize(then){
		then();
	}
	render(){
	}
	setConfiguration(config){
		this.config.configuration = config;
	}
	findByPrimaryKey(pk){
		console.log('DataManager#findByPrimaryKey('+pk+')');
		let interactionConfig = this.getConfiguration().findByPrimaryKey;
		let type = 'local';
		let method = 'GET';
		let payload = {};
		let uri = interactionConfig.uri;
		if(typeof interactionConfig.uri!='undefined'){
			var paths = interactionConfig.uri.split('/');
			var substitutedUri = '';
			console.log('substituing GET uri '+interactionConfig.uri);
			console.log(paths);
			for(var i=0;i<paths.length;i++){
				let path = paths[i];
				if(path.length>0){
					console.log('-evaluating path '+path);
					substitutedUri += this.substitute(path,pk);
				}
				if(i<paths.length-1){
					substitutedUri += '/';
				}
				console.log('substitutedUri = '+substitutedUri);
			}
			if(interactionConfig.uri.endsWith('/')){
				substitutedUri += '/';
			}
			uri = substitutedUri;
		}
		if(typeof interactionConfig.type!='undefined'){
			type = interactionConfig.type;
		}
		if(typeof interactionConfig.method!='undefined'){
			method = interactionConfig.method;
		}
		if(typeof filterExpr!='undefined'){
			payload = filterExpr;
		}else{
			if(typeof interactionConfig.payload!='undefined'){
				payload = interactionConfig.payload;
			}
		}
		var dataManagerWrapper = new DataManagerWrapper(this);
		if('local'==type){
			makeRESTCall(method,uri,payload,function(response){
				if(response.status==200){
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';'
						try{
							eval(toEval);
							dataManagerWrapper.interactionCallback(data);
						}catch(t){
							if(dataManagerWrapper.onErrorCallback!=null){
								dataManagerWrapper.onErrorCallback('dataManager.js#findByPrimaryKey() - exception evaluating adapter');
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
		}else{
			if(typeof interactionConfig.payload!='undefined'){
				payload = interactionConfig.payload;
			}
		}
		var dataManagerWrapper = new DataManagerWrapper(this);
		if('local'==type){
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
		var dataManagerWrapper = new DataManagerWrapper(this);
		if('local'==type){
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
								dataManagerWrapper.onErrorCallback('dataManager.js#create() - exception evaluating adapter');
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
	update(record){
		console.log('DataManager#update()');
		if(typeof record.id=='undefined'){
			return this.create(record);
		}else{
			let interactionConfig = this.getConfiguration().update;
			let type = 'local';
			let method = 'PUT';
			let payload = record;
			if(typeof interactionConfig.type!='undefined'){
				type = interactionConfig.type;
			}
			if(typeof interactionConfig.method!='undefined'){
				method = interactionConfig.method;
			}
			var dataManagerWrapper = new DataManagerWrapper(this);
			if('local'==type){
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
									dataManagerWrapper.onErrorCallback('dataManager.js#update() - exception evaluating adapter');
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
	}
	delete(record){
		console.log('DataManager#delete()');
		let interactionConfig = this.getConfiguration().delete;
		let type = 'local';
		let method = 'DELETE';
		let uri = '/';
		let payload = {};
		if(typeof interactionConfig.type!='undefined'){
			type = interactionConfig.type;
		}
		if(typeof interactionConfig.uri!='undefined'){
			var paths = interactionConfig.uri.split('/');
			var substitutedUri = '';
			console.log('substituing DELETE uri '+interactionConfig.uri);
			console.log(paths);
			for(var i=0;i<paths.length;i++){
				let path = paths[i];
				if(path.length>0){
					console.log('-evaluating path '+path);
					substitutedUri += this.substitute(path,record);
				}
				if(i<paths.length-1){
					substitutedUri += '/';
				}
				console.log('substitutedUri = '+substitutedUri);
			}
			if(interactionConfig.uri.endsWith('/')){
				substitutedUri += '/';
			}
			uri = substitutedUri;
		}
		if(typeof interactionConfig.method!='undefined'){
			method = interactionConfig.method;
		}
		if(typeof interactionConfig.payload!='undefined'){
			payload = this.substitute(interactionConfig.payload,record);
		}
		var dataManagerWrapper = new DataManagerWrapper(this);
		if('local'==type){
			makeRESTCall(method,uri,payload,function(response){
				if(response.status==200){
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';';
						try{
							eval(toEval);
							dataManagerWrapper.interactionCallback(data);
						}catch(t){
							if(dataManagerWrapper.onErrorCallback!=null){
								dataManagerWrapper.onErrorCallback('dataManager.js#delete() - exception evaluating adapter');
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
	substitute(pattern,data){
		console.log('DataManager#substitute('+pattern+',data)');
		console.log('data: '+JSON.stringify(data));
		let obj = '';
		if(pattern.indexOf('@')>=0){
			let toEval = 'obj = '+pattern.replace(/@/g,'data')+';';
			try{
				eval(toEval);
			}catch(t){
				console.log('DataManager#substitute(): exception evaluating '+toEval);
				console.log(t);
			}
		}else{
			obj = pattern;
		}
		console.log('DataManager#substitute() returning '+obj);
		return obj;
	}
}