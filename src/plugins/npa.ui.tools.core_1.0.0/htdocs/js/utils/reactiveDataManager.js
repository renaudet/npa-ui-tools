/*
 * reactiveDataManager.js - NPA UI Tools Core component framework's ReactiveDataManager component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
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

class ReactiveDataEvent{
	type = null;
	datatype = null;
	source = null;
	constructor(source,type,datatype){
		this.source = source;
		this.type = type;
		this.datatype = datatype;
	}
}
 
npaUiCore.ReactiveDataManager = class ReactiveDataManager extends NpaUiComponent{
	webSocket = null;
	datatype = null;
	listeners = [];
	initialize(then){
		let manager = this;
		this.webSocket = new WebSocket('/npaUi/ws');
		this.webSocket.onmessage = function(event){
			try{
		      let jsonMessage = JSON.parse(event.data);
		      if(typeof jsonMessage=='object' && jsonMessage.source && jsonMessage.type&& jsonMessage.datatype){
		        try{
		            manager.onNotification(jsonMessage);
		        }catch(e){
		          console.log(e);
		        }
		      }
		    }catch(cce){
		      console.log('ReactiveDataManager: received non-JSON message on WebSocket');
		    }
		};
		this.webSocket.onopen= function(event){
			if(this.readyState==this.OPEN){
			  console.log('ReactiveDataManager#initialize() WebSocket is now open');
		      manager.sendNotification('connect','');
		      then();
		    }
		};
	}
	render(then){
		then();
	}
	setConfiguration(config){
		this.config.configuration = config;
	}
	setDatatype(datatype){
		this.datatype = datatype;
	}
	findByPrimaryKey(pk){
		console.log('ReactiveDataManager#findByPrimaryKey('+pk+')');
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
								dataManagerWrapper.onErrorCallback('ReactiveDataManager#findByPrimaryKey() - exception evaluating adapter');
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
		console.log('ReactiveDataManager#query()');
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
								dataManagerWrapper.onErrorCallback('ReactiveDataManager#query() - exception evaluating adapter');
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
		console.log('ReactiveDataManager#create()');
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
		let manager = this;
		if('local'==type){
			makeRESTCall(method,interactionConfig.uri,payload,function(response){
				if(response.status==200){
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';'
						try{
							eval(toEval);
							manager.sendNotification('create',manager.datatype,{"id": data.id});
							dataManagerWrapper.interactionCallback(data);
						}catch(t){
							if(dataManagerWrapper.onErrorCallback!=null){
								dataManagerWrapper.onErrorCallback('ReactiveDataManager#create() - exception evaluating adapter');
							}
						}
					}else{
						manager.sendNotification('create',manager.datatype,{"id": response.id});
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
		console.log('ReactiveDataManager#update()');
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
			let manager = this;
			if('local'==type){
				makeRESTCall(method,interactionConfig.uri,payload,function(response){
					if(response.status==200){
						manager.sendNotification('update',manager.datatype,{"id": record.id});
						if(typeof interactionConfig.adapter!='undefined'){
							var data = [];
							var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';'
							try{
								eval(toEval);
								dataManagerWrapper.interactionCallback(data);
							}catch(t){
								if(dataManagerWrapper.onErrorCallback!=null){
									dataManagerWrapper.onErrorCallback('ReactiveDataManager#update() - exception evaluating adapter');
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
		console.log('ReactiveDataManager#delete()');
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
		let manager = this;
		if('local'==type){
			makeRESTCall(method,uri,payload,function(response){
				if(response.status==200){
					manager.sendNotification('delete',manager.datatype,{"id": record.id});
					if(typeof interactionConfig.adapter!='undefined'){
						var data = [];
						var toEval = 'data = '+interactionConfig.adapter.replace(/@/g,'response')+';';
						try{
							eval(toEval);
							dataManagerWrapper.interactionCallback(data);
						}catch(t){
							if(dataManagerWrapper.onErrorCallback!=null){
								dataManagerWrapper.onErrorCallback('ReactiveDataManager#delete() - exception evaluating adapter');
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
		console.log('ReactiveDataManager#substitute('+pattern+',data)');
		console.log('data: '+JSON.stringify(data));
		let obj = '';
		if(pattern.indexOf('@')>=0){
			let toEval = 'obj = '+pattern.replace(/@/g,'data')+';';
			try{
				eval(toEval);
			}catch(t){
				console.log('ReactiveDataManager#substitute(): exception evaluating '+toEval);
				console.log(t);
			}
		}else{
			obj = pattern;
		}
		console.log('ReactiveDataManager#substitute() returning '+obj);
		return obj;
	}
	sendNotification(type,datatype,data=null){
		console.log('ReactiveDataManager#sendNotification('+type+','+datatype+')');
		if(data){
			console.log('additional data: '+JSON.stringify(data));
		}
		let dataEvent = new ReactiveDataEvent(this.getId(),type,datatype);
		if(data){
			Object.assign(dataEvent,data);
		}
		this.webSocket.send(JSON.stringify(dataEvent));
	}
	onNotification(dataEvent){
		console.log('ReactiveDataManager#onNotification()');
		console.log(dataEvent);
		if('create'==dataEvent.type || 'update'==dataEvent.type || 'delete'==dataEvent.type){
			for(var i=0;i<this.listeners.length;i++){
				let listener = this.listeners[i];
				try{
					listener.onNotification(dataEvent);
				}catch(e){}
			}
		}
	}
	addNotificationListener(listener){
		this.listeners.push(listener);
	}
}