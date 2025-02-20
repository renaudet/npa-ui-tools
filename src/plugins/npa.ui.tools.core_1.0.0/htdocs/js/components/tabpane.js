/*
 * tabpane.js - NPA UI Tools Core component framework's TabPane component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.TabPane = class TabPane extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/tabPane.css',then);
	}
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			var classList = this.parentDiv().attr('class').split(/\s+/);
			let namespace = (classList && classList.length>0)?classList[0]:'npaUi';
			let childs = {};
			$('#'+this.parentDivId+' div').each(function(){
				if(typeof $(this).data('tab-target')!='undefined' && 
				   $(this).data('tab-target')!=null && 
				   $(this).data('tab-target').length>0){
					console.log('detaching child DIV with target: '+$(this).data('tab-target'));
					childs[$(this).data('tab-target')] = $(this).detach();
				}
			});
			let html = '';
			html += '<ul id="'+this.getId()+'" class="nav nav-tabs npa-tab-header" role="tablist">';
			for(var i=0;i<config.tabs.length;i++){
				let tab = config.tabs[i];
				let active = true;
				if(typeof tab.active!='undefined' && !tab.active){
					active = false;
				}
				html += '  <li class="nav-item" role="presentation">';
				html += '    <button class="nav-link'+(i==0?' active':'')+'" id="'+tab.id+'" data-bs-toggle="tab" data-bs-target="#'+tab.id+'_pane" type="button" role="tab" aria-controls="'+tab.id+'-pane" aria-selected="'+(i==0?'true':'false')+'"'+(active?'':' disabled')+'>'+this.getLocalizedString(tab.label)+'</button>';
				html += '  </li>';
			}
			html += '</ul>';
			html += '<div class="tab-content npa-tab-content" id="'+this.getId()+'_content">';
			for(var i=0;i<config.tabs.length;i++){
				let tab = config.tabs[i];
				html += '  <div class="tab-pane fade show'+(i==0?' active':'')+'" id="'+tab.id+'_pane" role="tabpanel" aria-labelledby="'+tab.id+'" tabindex="0"></div>';
			}
			html += '</div>';
			this.parentDiv().append(html);
			
			let appendChild = function(child,targetId){
				setTimeout(function(){ $(targetId).append(child);npaUi.render(namespace);},500);
			}

			for(var tabId in childs){
				let div = childs[tabId];
				console.log('attaching child DIV with target '+tabId);
				console.log('child is:\n'+div.html());
				console.log('target div ID is '+'#'+tabId+'_pane');
				$('#'+tabId+'_pane').empty();
				if($('#'+tabId+'_pane')[0]){
					//$('#'+tabId+'_pane')[0].innerHTML = div.html();
					$('#'+tabId+'_pane').append(div);
				}else{
					appendChild(div,'#'+tabId+'_pane');
				}
			}
			then();
		}else{
			then();
		}
	}
}