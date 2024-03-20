/*
 * editor.js - NPA UI Tools Core component framework's Editor component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const DEPTS = [
	{"type": "css","uri": "/css/codemirror.css"},
	{"type": "css","uri": "/css/codeMirror/abcdef.css"},
	{"type": "css","uri": "/uiTools/css/editor.css"},
	{"type": "js","uri": "/js/codemirror.js"},
	{"type": "js","uri": "/js/codeMirror/autorefresh.js"},
	{"type": "js","uri": "/js/codeMirror/javascript.js"},
	{"type": "js","uri": "/js/codeMirror/loadmode.js"},
	{"type": "js","uri": "/js/codeMirror/meta.js"}
];
const DEFAULT_HEIGHT = 300;

npaUiCore.Editor = class Editor extends NpaUiComponent{
	editor = null;
	pluggableActionHandlers = {};
	initialize(then){
		loadDeps(DEPTS,then);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		if(typeof config.toolbar!='undefined' && 'top'==config.toolbar.position){
			html += '<div class="editor-toolbar">';
			$('.editor-btn').off('.'+this.getId());
			for(var i=0;i<config.toolbar.actions.length;i++){
				let action = config.toolbar.actions[i];
				if(typeof action.type!='undefined' && 'separator'==action.type){
					html += '<span class="editor-separator"></span>';
				}else{
					html += '<button type="button" class="btn btn-sm editor-btn" data-action="'+action.actionId+'">';
					html += '<img src="'+action.icon+'" title="'+this.getLocalizedString(action.label)+'" class="editor-icon">';
					html += '</button>';
				}
			}
			html += '</div>';
		}
		html += '<textarea id="'+this.getId()+'" class="form-control" style="border: 1px solid lightgrey; background-color: #fff;"></textarea>';
		if(typeof config.toolbar!='undefined' && 'bottom'==config.toolbar.position){
			html += '<div class="editor-toolbar">';
			$('.editor-btn').off('.'+this.getId());
			for(var i=0;i<config.toolbar.actions.length;i++){
				let action = config.toolbar.actions[i];
				if(typeof action.type!='undefined' && 'separator'==action.type){
					html += '<span class="editor-separator"></span>';
				}else{
					html += '<button type="button" class="btn btn-sm editor-btn" data-action="'+action.actionId+'">';
					html += '<img src="'+action.icon+'" title="'+this.getLocalizedString(action.label)+'" class="editor-icon">';
					html += '</button>';
				}
			}
			html += '</div>';
		}
		this.parentDiv().html(html);
		if(typeof config.toolbar!='undefined'){
			for(var i=0;i<config.toolbar.actions.length;i++){
				let action = config.toolbar.actions[i];
				if(typeof action.enabled!='undefined' && !action.enabled){
					this.setEnabled(action.actionId,false);
				}
			}
			if(config.toolbar.pluggableActionHandlers && config.toolbar.pluggableActionHandlers.length>0){
				for(var i=0;i<config.toolbar.pluggableActionHandlers.length;i++){
					let actionHandlerConfig = config.toolbar.pluggableActionHandlers[i];
					this.pluggableActionHandlers[actionHandlerConfig.actionId] = actionHandlerConfig;
				}
			}
		}
		var textarea = document.getElementById(this.getId());
		var readonly = true;
		if(typeof config.readonly!='undefined'){
			readonly = config.readonly;
		}
		this.editor = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			autoRefresh:true,
			theme: "abcdef",
			mode:  "javascript",
			readOnly: readonly
		});
		let source = this;
		setTimeout(function(){ source.editor.setOption("mode","javascript"); },100);
		if(typeof config.height!='undefined'){
			this.editor.setSize(null,config.height);
		}else{
			this.editor.setSize(null,DEFAULT_HEIGHT);
		}
		if(typeof config.toolbar!='undefined'){
			let editor = this;
			$('.editor-btn').on('click.'+this.getId(),function(){
				let actionId = $(this).data('action');
				editor.triggersActionEvent(actionId)
			});
		}
	}
	triggersActionEvent(actionId){
		let actionHandler = this.pluggableActionHandlers[actionId];
		if(typeof actionHandler!='undefined'){
			try{
				let toEval = actionHandler.handlerExpr.replace(/@/g,'this').replace(/\$/g,'npaUi.getComponent');
				eval(toEval);
			}catch(e){
				console.log('npaUi#editor#triggersActionEvent('+actionId+')');
				console.log(e);
			}
		}
		npaUi.fireEvent(actionId,{"source": this.getId(),"actionId": actionId});
	}
	setReadonly(readonly){
		this.editor.setOption('readOnly',readonly);
		let comp = this;
		setTimeout(function(){ comp.editor.refresh();comp.editor.focus();},200);
	}
	setText(txt){
		this.editor.setValue(txt);
	}
	getText(){
		return this.editor.getValue();
	}
	setEnabled(actionId,enableState){
		$('.editor-btn').each(function(){
			let btnActionId = $(this).data('action');
			if(btnActionId==actionId){
				$(this).prop('disabled',!enableState);
			}
		});
	}
	onItemSelected(item){
		if(typeof item=='undefined' || item==null){
			this.setText('');
			this.setReadonly(true);
			let config = this.getConfiguration();
			if(typeof config.toolbar!='undefined'){
				for(var i=0;i<config.toolbar.actions.length;i++){
					let action = config.toolbar.actions[i];
					this.setEnabled(action.actionId,false);
				}
			}
		}else{
			let config = this.getConfiguration();
			if(typeof config.contentAdapter!='undefined'){
				let txt = '';
				let toEval = 'txt = '+config.contentAdapter.replace(/@/g,'item')+';';
				try{
					eval(toEval);
					this.setText(txt);
				}catch(e){
					console.log(e);
				}
			}else{
				this.setText(JSON.stringify(item,null,'\t'));
			}
			if(typeof config.toolbar!='undefined'){
				for(var i=0;i<config.toolbar.actions.length;i++){
					let action = config.toolbar.actions[i];
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
	}
}