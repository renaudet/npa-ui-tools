/*
 * tabpane.js - NPA UI Tools Core component framework's TabPane component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.TabPane = class TabPane extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/tabPane.css',then);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		html += '<ul class="nav nav-tabs" role="tablist">';
		for(var i=0;i<config.tabs.length;i++){
			let tab = config.tabs[i];
			let active = true;
			if(typeof tab.active!='undefined' && !tab.active){
				active = false;
			}
			html += '  <li class="nav-item" role="presentation">';
			html += '    <button class="nav-link'+(i==0?' active':'')+'" id="'+tab.id+'" data-bs-toggle="tab" data-bs-target="#'+tab.id+'-pane" type="button" role="tab" aria-controls="'+tab.id+'-pane" aria-selected="'+(i==0?'true':'false')+'"'+(active?'':' disabled')+'>'+this.getLocalizedString(tab.label)+'</button>';
			html += '  </li>';
		}
		html += '</ul>';
		html += '<div class="tab-content" id="'+this.getId()+'_content">';
		for(var i=0;i<config.tabs.length;i++){
			let tab = config.tabs[i];
			html += '  <div class="tab-pane fade show'+(i==0?' active':'')+'" id="'+tab.id+'-pane" role="tabpanel" aria-labelledby="'+tab.id+'" tabindex="0">Content for '+this.getLocalizedString(tab.label)+'</div>';
		}
		html += '</div>';
		this.parentDiv().html(html);
	}
}