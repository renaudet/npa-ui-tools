/*
 * card.js - NPA UI Tools Core component framework's Card component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
const DEFAULT_CONTENT_DIV_ID = 'workArea';

function stretchWorkArea(contentDivId,height=-1){
	if(height==-1){
		$(window).on('resize',function(){
			let newHeight = $(window).height()-140;
			$('#'+contentDivId).height(newHeight);
			$('.card-scrollable').css('max-height',newHeight+'px');
		});
		$(window).trigger('resize');
	}else{
		$('#'+contentDivId).height(height);
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
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let child = null;
			if($('#'+this.parentDivId+' div').length>0){
				 child = $('#'+this.parentDivId+' div').first().detach();
			}
			let contentDivId = DEFAULT_CONTENT_DIV_ID;
			if(typeof config.contentDivId!='undefined' && config.contentDivId.length>0){
				contentDivId = config.contentDivId;
			}
			let html = '';
			html += '<div id="'+this.getId()+'" class="card" style="margin-left: 3px;margin-right: 3px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;">';
			html += '  <div class="card-header'+this.getHeaderClass()+'">';
			html += '    <img id="'+this.getId()+'_icon" src="'+config.icon+'" width="20" style="padding-bottom: 3px;"><span id="scafPageTitle" style="padding-left: 15px;">'+this.getLocalizedString(config.label)+'</span>&nbsp;&nbsp;&nbsp;<span class="visually-hidden spinner-border spinner-border-sm text-light" aria-hidden="true"></span>';
			html += '  </div>';
			html += '  <ul class="list-group list-group-flush">';
			html += '    <li id="'+contentDivId+'" class="list-group-item card-working-area"></li>';
			html += '  </ul>';
			html += '  <div id="'+this.getId()+'_status" class="card-footer npa-card-footer" style="padding-top: 0px;padding-bottom: 0px;padding-left: 5px;">&nbsp;</div>';
			html += '</div>';
			this.parentDiv().html(html);
			if(typeof config.height!='undefined'){
				stretchWorkArea(contentDivId,config.height);
			}else{
				stretchWorkArea(contentDivId);
			}
			if(child){
				$('#'+contentDivId).append(child);
			}
			then();
		}else{
			then();
		}
	}
	getHeaderClass(){
		if(typeof this.getConfiguration().headerClass!='undefined'){
			return ' '+this.getConfiguration().headerClass;
		}else{
			return ' npa-card-header';
		}
	}
	getContentDivId(){
		let config = this.getConfiguration();
		if(typeof config.contentDivId!='undefined' && config.contentDivId.length>0){
			return config.contentDivId;
		}else{
			return DEFAULT_CONTENT_DIV_ID;
		}
	}
	setIcon(iconPath){
		$('#'+this.getId()+'_icon').prop('src',iconPath);
	}
	setStatus(txt){
		if(txt && txt.length>0){
			$('#'+this.getId()+'_status').html(txt);
		}else{
			$('#'+this.getId()+'_status').html('&nbsp;');
		}
	}
	setContent(html){
		$('#'+this.getContentDivId()).html(html);
	}
	clearStatus(txt){
		$('#'+this.getId()+'_status').empty();
	}
}