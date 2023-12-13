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
	render(){
		if($('#'+this.id).data('loaded')!='true'){
			let child = null;
			if($('#'+this.id+' div').length>0){
				 child = $('#'+this.id+' div').detach();
			}
			let html = '';
			let style='';
			if(typeof this.config.configuration.height!='undefined'){
				style += 'height: '+this.config.configuration.height+'px;';
			}
			html += '<div id="'+this.config.id+'" class="card" style="margin-left: 3px;margin-right: 3px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;'+style+'">';
			html += '  <div class="card-header">';
			html += '    <img src="'+this.config.configuration.icon+'" width="20" style="padding-bottom: 3px;"><span id="scafPageTitle" style="padding-left: 15px;">'+this.config.configuration.label+'</span>&nbsp;&nbsp;&nbsp;<span class="visually-hidden spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>';
			html += '  </div>';
			html += '  <ul class="list-group list-group-flush">';
			html += '    <li id="workArea" class="list-group-item"></li>';
			html += '  </ul>';
			html += '  <div id="statusBar" class="card-footer" style="padding-top: 0px;padding-bottom: 0px;padding-left: 5px;">&nbsp;</div>';
			html += '</div>';
			$('#'+this.id).html(html);
			stretchWorkArea();
			if(child){
				$('#workArea').append(child);
			}
		}
	}
}