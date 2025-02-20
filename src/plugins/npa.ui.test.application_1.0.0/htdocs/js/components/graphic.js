/*
 * graphic.js - NPA Test Application Graphic component
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
if(typeof npaTest=='undefined'){
	npaTest = {};
}
 
npaTest.Graphic = class Graphic extends NpaUiComponent{
	gcManager = null;
	initialize(then){
		if(typeof ReactivArea=='undefined'){
			$.loadScript('/js/graphicUtils.js',then);
		}else{
			then();
		}
	}
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			this.gcManager = new ReactivArea(this.getId(),this.parentDivId,config.width,config.height);
			this.gcManager.background = config.backgroundColor;
			this.gcManager.init();
		}else{
			this.gcManager.repaint();
		}
		then();
	}
}