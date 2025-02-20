/*
 * card.js - NPA UI Tools Core component framework's Card component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
if(typeof npaTest=='undefined'){
	npaTest = {};
}

function stretchWorkArea(){
	$('#workArea').height($(window).height()-140);
	$(window).on('resize',function(){
		$('#workArea').height($(window).height()-140);
	});
}
 
npaTest.Card = class Card extends NpaUiComponent{
	render(then){
		let config = this.getConfiguration();
		let html = '';
		let style='';
		if(typeof config.height!='undefined'){
			style += 'height: '+config.height+'px;';
		}
		html += '<div id="'+this.getId()+'" class="card" style="margin-left: 3px;margin-right: 3px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;'+style+'">';
		html += '  <div class="card-header" style="background-color: #d6c4f5;">';
		html += '    <img src="'+config.icon+'" width="20" style="padding-bottom: 3px;"><span id="scafPageTitle" style="padding-left: 15px;">'+config.label+'</span>&nbsp;&nbsp;&nbsp;<span class="visually-hidden spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>';
		html += '  </div>';
		html += '  <ul class="list-group list-group-flush">';
		html += '    <li id="workArea" class="list-group-item"></li>';
		html += '  </ul>';
		html += '  <div id="statusBar" class="card-footer" style="padding-top: 0px;padding-bottom: 0px;padding-left: 5px;">&nbsp;</div>';
		html += '</div>';
		this.parentDiv().html(html);
		stretchWorkArea();
		then();
	}
}