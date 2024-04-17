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
				if(typeof action.type!='undefined'){
					if('separator'==action.type){
						html += '<span class="toolbar-separator"></span>';
					}
					if('control'==action.type && 'filter'==action.kind){
						html += '&nbsp;<input id="'+this.getId()+'_filter_'+action.actionId+'" type="text" style="width: '+action.width+'px;line-height: 0.7rem;vertical-align: middle;">';
						html += '<button class="toolbar-btn" style="line-height: 1.2rem;vertical-align: middle;" type="button" data-action="'+action.actionId+'">';
						html += this.getLocalizedString(action.label);
						html += '</button>';
					}
					if('conditional'==action.type){
						html += '<button id="'+this.getId()+'_'+action.actionId+'" type="button" class="btn btn-sm toolbar-btn" data-action="'+action.actionId+'" style="display: none;">';
						if(typeof action.icon!='undefined'){
							html += '<img src="'+action.icon+'" title="'+this.getLocalizedString(action.label)+'" class="toolbar-icon">';
						}
						if(typeof action.symbol!='undefined'){
							html += '<span class="toolbar-symbol">'+action.symbol+'</span>';
						}
						html += '</button>';
					}
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
				if(typeof action.type!='undefined' && 'control'==action.type && 'filter'==action.kind){
					let actionId = action.actionId;
					$('#'+this.getId()+'_filter_'+actionId).on('keypress.'+this.getId(),function(e){
						if(e.keyCode === 13){
					    	toolbar.triggersActionEvent(actionId);
					    }
					});
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
		if($('#'+this.getId()+'_filter_'+actionId).length>0){
			let filterExpr = $('#'+this.getId()+'_filter_'+actionId).val();
			npaUi.fireEvent(actionId,{"source": this.getId(),"actionId": actionId,"data": filterExpr});
		}else{
			npaUi.fireEvent(actionId,{"source": this.getId(),"actionId": actionId});
		}
	}
	setEnabled(actionId,enableState){
		console.log('npaUi#toolbar#setEnabled('+actionId+','+enableState+')');
		$('.toolbar-btn').each(function(){
			let btnActionId = $(this).data('action');
			if(btnActionId==actionId){
				$(this).prop('disabled',!enableState);
				$(this).css('display','inline');
			}
		});
	}
	setSpecificConfig(actionId,config){
		console.log('npaUi#toolbar#setSpecificConfig('+actionId+')');
		console.log(config);
		let buttonId = this.getId()+'_'+actionId;
		if($('#'+buttonId).length==1){
			if(config.icon){
				$('#'+buttonId+' img').prop('src',config.icon);
			}
			if(config.label){
				$('#'+buttonId+' img').prop('title',config.label);
			}
		}
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