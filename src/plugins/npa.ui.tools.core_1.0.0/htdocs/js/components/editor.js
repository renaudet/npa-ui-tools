/*
 * editor.js - NPA UI Tools Core component framework's Editor component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
const DEPTS = [
	{"type": "css","uri": "/css/codemirror.css"},
	{"type": "css","uri": "/css/codeMirror/abcdef.css"},
	{"type": "css","uri": "/css/codeMirror/ambiance.css"},
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
		html += '<textarea id="'+this.getId()+'" class="form-control" style="border: 1px solid lightgrey; background-color: #fff;"></textarea>';
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
}