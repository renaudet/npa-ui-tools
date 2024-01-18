/*
 * card.js - NPA UI Tools Core component framework's Card component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
function stretchWorkArea(){
	$('#workArea').height($(window).height()-140);
	$(window).on('resize',function(){
		$('#workArea').height($(window).height()-140);
	});
}
 
npaUiCore.Card = class Card extends NpaUiComponent{
	initialize(then){
		if(this.getConfiguration().stylesheet){
			$.loadCss(this.getConfiguration().stylesheet,then);
		}else{
			$.loadCss('/uiTools/css/card.css',then);
		}
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let child = null;
			if($('#'+this.parentDivId+' div').length>0){
				 child = $('#'+this.parentDivId+' div').first().detach();
			}
			let html = '';
			let style='';
			if(typeof config.height!='undefined'){
				style += 'height: '+config.height+'px;';
			}
			html += '<div id="'+this.getId()+'" class="card" style="margin-left: 3px;margin-right: 3px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;'+style+'">';
			html += '  <div class="card-header npa-card-header">';
			html += '    <img src="'+config.icon+'" width="20" style="padding-bottom: 3px;"><span id="scafPageTitle" style="padding-left: 15px;">'+this.getLocalizedString(config.label)+'</span>&nbsp;&nbsp;&nbsp;<span class="visually-hidden spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>';
			html += '  </div>';
			html += '  <ul class="list-group list-group-flush">';
			html += '    <li id="workArea" class="list-group-item"></li>';
			html += '  </ul>';
			html += '  <div id="statusBar" class="card-footer" style="padding-top: 0px;padding-bottom: 0px;padding-left: 5px;">&nbsp;</div>';
			html += '</div>';
			this.parentDiv().html(html);
			stretchWorkArea();
			if(child){
				$('#workArea').append(child);
			}
		}
	}
}