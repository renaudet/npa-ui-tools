/*
 * dynamicActionLoader.js - NPA UI Tools Core component framework's Dynamic Action Loader component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved 
 */

/* Work In Progress
 * "configuration": {
		"actionId": "<id>",
		"handler": "<handler-function-name>",
		"icon": "<path-to-icon>",
		"library": "<path-to-javascript-library>"
	}
 */
npaUiCore.DynamicActionLoader = class DynamicActionLoader extends NpaUiComponent{
	initialize(then){
		then();
	}
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			$.loadScript(config.library, function(){
				npaUi.on(config.actionId,window[config.handler]);
				then();
			});
		}else{
			then();
		}
	}
}