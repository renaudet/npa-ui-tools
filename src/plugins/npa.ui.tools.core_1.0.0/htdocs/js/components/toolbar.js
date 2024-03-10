/*
 * toolbar.js - NPA UI Tools Core component framework's Toolbar component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Toolbar = class Toolbar extends NpaUiComponent{
	pluggableActionHandlers = {};
	initialize(then){
		$.loadCss('/uiTools/css/toolbar.css',then);
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let html = '';
			html += '<div id="'+this.getId()+'" class="toolbar">';
			$('.toolbar-btn').off('.'+this.getId());
			for(var i=0;i<config.actions.length;i++){
				let action = config.actions[i];
				if(typeof action.type!='undefined' && 'separator'==action.type){
					html += '<span class="toolbar-separator"></span>';
				}else{
					html += '<button id="'+this.getId()+'_'+action.actionId+'" type="button" class="btn btn-sm toolbar-btn" data-action="'+action.actionId+'">';
					if(typeof action.icon!='undefined'){
						html += '<img src="'+action.icon+'" title="'+this.getLocalizedString(action.label)+'" class="toolbar-icon">';
					}
					if(typeof action.symbol!='undefined'){
						html += '<span class="toolbar-symbol">'+action.symbol+'</span>';
					}
					html += '</button>';
				}
			}
			html += '</div>';
			this.parentDiv().html(html);
			let toolbar = this;
			$('.toolbar-btn').on('click.'+this.getId(),function(){
				let actionId = $(this).data('action');
				toolbar.triggersActionEvent(actionId);
			});
			for(var i=0;i<config.actions.length;i++){
				let action = config.actions[i];
				if(typeof action.enabled!='undefined' && !action.enabled){
					this.setEnabled(action.actionId,false);
				}
			}
			if(config.pluggableActionHandlers && config.pluggableActionHandlers.length>0){
				for(var i=0;i<config.pluggableActionHandlers.length;i++){
					let actionHandlerConfig = config.pluggableActionHandlers[i];
					this.pluggableActionHandlers[actionHandlerConfig.actionId] = actionHandlerConfig;
				}
			}
		}
	}
	triggersActionEvent(actionId){
		let actionHandler = this.pluggableActionHandlers[actionId];
		if(typeof actionHandler!='undefined'){
			try{
				let toEval = actionHandler.handlerExpr.replace(/@/g,'this').replace(/\$/g,'npaUi.getComponent');
				eval(toEval);
			}catch(e){
				console.log('npaUi#toolbar#triggersActionEvent('+actionId+')');
				console.log(e);
			}
		}
		npaUi.fireEvent(actionId,{"source": this.getId(),"actionId": actionId});
	}
	setEnabled(actionId,enableState){
		console.log('npaUi#toolbar#setEnabled('+actionId+','+enableState+')');
		$('.toolbar-btn').each(function(){
			let btnActionId = $(this).data('action');
			if(btnActionId==actionId){
				$(this).prop('disabled',!enableState);
			}
		});
	}
	onItemSelected(item){
		console.log('toolbar#onItemSelected()');
		let config = this.getConfiguration();
		for(var i=0;i<config.actions.length;i++){
			let action = config.actions[i];
			if(typeof action.enableOnSelection!='undefined'){
				if(action.enableOnSelection){
					this.setEnabled(action.actionId,true);
				}else{
					this.setEnabled(action.actionId,false);
				}
			}
		}
	}
}