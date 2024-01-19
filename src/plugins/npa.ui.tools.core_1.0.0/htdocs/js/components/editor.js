/*
 * editor.js - NPA UI Tools Core component framework's Editor component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const DEPTS = [
	{"type": "css","uri": "/css/codemirror.css"},
	{"type": "css","uri": "/css/codeMirror/abcdef.css"},
	{"type": "css","uri": "/css/codeMirror/ambiance.css"},
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
		var textarea = document.getElementById(this.getId());
		var readonly = true;
		if(typeof config.readonly!='undefined'){
			readonly = config.readonly;
		}
		this.editor = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			autoRefresh:true,
			theme: 'abcdef',
			mode:  "javascript",
			readOnly: readonly
		});
		if(typeof config.height!='undefined'){
			this.editor.setSize(null,config.height);
		}else{
			this.editor.setSize(null,DEFAULT_HEIGHT);
		}
		if(typeof config.toolbar!='undefined'){
			let editor = this;
			$('.editor-btn').on('click.'+this.getId(),function(){
				let actionId = $(this).data('action');
				npaUi.fireEvent(actionId,{"source": editor.getId(),"actionId": actionId});
			});
		}
	}
	setReadonly(readonly){
		this.editor.setOption('readOnly',readonly);
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
}