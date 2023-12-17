/*
 * panel.js - NPA UI Tools Core component framework's Panel component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Panel = class Panel extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/npaUiTheme.css',then);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		let style='';
		if(typeof config.height!='undefined'){
			style += 'height: '+config.height+'px;';
		}
		html += '<div id="'+this.getId()+'" class="panel" style="'+style+'"></div>';
		this.parentDiv().html(html);
	}
}