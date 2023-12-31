/*
 * toolbar.js - NPA UI Tools Core component framework's Toolbar component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Toolbar = class Toolbar extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/toolbar.css',then);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		html += '<div class="toolbar">';
		$('.toolbar-btn').off('.'+this.getId());
		for(var i=0;i<config.actions.length;i++){
			let action = config.actions[i];
			if(typeof action.type!='undefined' && 'separator'==action.type){
				html += '<span class="toolbar-separator"></span>';
			}else{
				html += '<button id="'+this.getId()+'_'+action.actionId+'" type="button" class="btn btn-sm toolbar-btn" data-action="'+action.actionId+'">';
				html += '<img src="'+action.icon+'" title="'+action.label+'" class="toolbar-icon">';
				html += '</button>';
			}
		}
		html += '</div>';
		this.parentDiv().html(html);
		let toolbar = this;
		$('.toolbar-btn').on('click.'+this.getId(),function(){
			let actionId = $(this).data('action');
			npaUi.fireEvent(actionId,{"source": toolbar.getId(),"actionId": actionId});
		});
	}
	setEnabled(actionId,enableState){
		$('.toolbar-btn').each(function(){
			let btnActionId = $(this).data('action');
			if(btnActionId==actionId){
				$(this).prop('disabled',!enableState);
			}
		});
	}
}