/*
 * panel.js - NPA UI Tools Core component framework's Panel component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Panel = class Panel extends NpaUiComponent{
	render(){
		let html = '';
		let style='';
		if(typeof this.config.configuration.height!='undefined'){
			style += 'height: '+this.config.configuration.height+'px;';
		}
		html += '<div id="'+this.config.id+'" class="panel" style="'+style+'"></div>';
		$('#'+this.id).html(html);
	}
}