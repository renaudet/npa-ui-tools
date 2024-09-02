/*
 * console.js - NPA UI Tools Core component framework's Console component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
const DEFAULT_CONSOLE_HEIGHT = 300;
 
npaUiCore.Console = class Console extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/console.css',then);
	}
	render(){
		let html = '';
		let style = '';
		style += 'height:'+this.getHeight()+'px;';
		style += 'max-height:'+this.getHeight()+'px;overflow: auto;';
		style += this.getCustomStyle();
		html += '<div id="'+this.getId()+'" class="npa-console" style="'+style+'">&nbsp;</div>';
		this.parentDiv().html(html);
	}
	getHeight(){
		if(this.getConfiguration().height){
			return this.getConfiguration().height;
		}else{
			return DEFAULT_CONSOLE_HEIGHT;
		}
	}
	getCustomStyle(){
		if(this.getConfiguration().style){
			return this.getConfiguration().style;
		}else{
			return '';
		}
	}
	setHeight(height){
		$('#'+this.getId()).height(height);
		$('#'+this.getId()).css('max-height',height+'px');
	}
	clear(){
		$('#'+this.getId()).empty();
	}
	println(text){
		$('#'+this.getId()).append(text.replace(/\t/g,'&nbsp;&nbsp;&nbsp;').replace(/\r/g,'r').replace(/\n/g,'<br>')+'<br>');
		$('#'+this.getId()).scrollTop($('#'+this.getId()).prop('scrollHeight'));
	};
	print(text){
		$('#'+this.getId()).append(text.replace(/\t/g,'&nbsp;&nbsp;&nbsp;').replace(/\r/g,'').replace(/\n/g,'<br>'));
	};
}