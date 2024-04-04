/*
 * verticalMenu.js - NPA UI Tools Core component framework's VerticalMenu component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.VerticalMenu = class VerticalMenu extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/verticalMenu.css',then);
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let childs = {};
			$('#'+this.parentDivId+' div').each(function(){
				if(typeof $(this).data('menu-ref')!='undefined' && 
				   $(this).data('menu-ref')!=null && 
				   $(this).data('menu-ref').length>0){
					console.log('detaching child DIV with target: '+$(this).data('menu-ref'));
					childs[$(this).data('menu-ref')] = $(this).detach();
				}
			});
			
			let html = '';
			html += '<div class="row">';
			html += '  <div class="col-2 npa-vertical-menu">';
			html += '    <ul id="'+this.getId()+'" class="nav flex-column">';
			for(var i=0;i<config.items.length;i++){
				let item = config.items[i];
				let active = true;
				if(typeof item.active!='undefined' && !item.active){
					active = false;
				}
				html += '  <li class="nav-item">';
				html += '    <a class="nav-link npa-vertical-item '+(i==0?' active':'')+(active?'':' disabled')+'" id="'+item.id+'" href="#">'+this.getLocalizedString(item.label)+'</a>';
				html += '  </li>';
			}
			html += '    </ul>';
			
			html += '  </div>';
			html += '  <div id="'+this.getId()+'_content" class="col-10"></div>';
			html += '</div>';
			this.parentDiv().html(html);
			this.stretch();
			
			$('#'+this.getId()+'_content').empty();
			for(var menuRef in childs){
				let div = childs[menuRef];
				console.log('attaching child DIV with menu reference:  '+menuRef);
				$('#'+this.getId()+'_content').append(div);
				div.css('display','none');
			}
			if(config.items.length>0){
				let firstMenuItem = config.items[0];
				let contentDiv = childs[firstMenuItem.id];
				contentDiv.css('display','inline');
			}
			let verticalMenu = this;
			$('.npa-vertical-item').on('click',function(){
				let id = $(this).attr('id');
				for(var menuRef in childs){
					let div = childs[menuRef];
					if(menuRef!=id){
						div.css('display','none');
					}else{
						div.css('display','inline');
						npaUi.fireEvent('menu.item.selected',{"source": verticalMenu.getId(),"menu": menuRef});
					}
					//npaUi.fireEvent('menu.item.selected',{"source": verticalMenu.getId(),"menu": menuRef});
				}
			});
		}
	}
	stretch(){
		let config = this.getConfiguration();
		if(typeof config.expandsTo!='undefined'){
			$('#'+this.getId()).height($('#'+config.expandsTo).height()-10);
			let menu = this;
			$(window).on('resize',function(){
				$('#'+menu.getId()).height($('#'+config.expandsTo).height()-10);
			});
		}
	}
}