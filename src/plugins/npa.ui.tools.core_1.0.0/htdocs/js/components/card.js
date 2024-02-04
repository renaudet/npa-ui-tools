/*
 * card.js - NPA UI Tools Core component framework's Card component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
function stretchWorkArea(height=-1){
	if(height==-1){
		$(window).on('resize',function(){
			let newHeight = $(window).height()-140;
			$('#workArea').height(newHeight);
			$('.card-scrollable').css('max-height',newHeight+'px');
		});
		$(window).trigger('resize');
	}else{
		$('#workArea').height(height);
	}
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
			html += '<div id="'+this.getId()+'" class="card" style="margin-left: 3px;margin-right: 3px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;">';
			html += '  <div class="card-header npa-card-header">';
			html += '    <img src="'+config.icon+'" width="20" style="padding-bottom: 3px;"><span id="scafPageTitle" style="padding-left: 15px;">'+this.getLocalizedString(config.label)+'</span>&nbsp;&nbsp;&nbsp;<span class="visually-hidden spinner-border spinner-border-sm text-light" aria-hidden="true"></span>';
			html += '  </div>';
			html += '  <ul class="list-group list-group-flush">';
			html += '    <li id="workArea" class="list-group-item"></li>';
			html += '  </ul>';
			html += '  <div id="statusBar" class="card-footer" style="padding-top: 0px;padding-bottom: 0px;padding-left: 5px;">&nbsp;</div>';
			html += '</div>';
			this.parentDiv().html(html);
			if(typeof config.height!='undefined'){
				stretchWorkArea(config.height);
			}else{
				stretchWorkArea();
			}
			if(child){
				$('#workArea').append(child);
			}
		}
	}
}