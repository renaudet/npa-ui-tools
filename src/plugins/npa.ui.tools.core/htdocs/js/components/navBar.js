/*
 * navBar.js - NPA UI Tools Core component framework's NavBar component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 

npaUiCore.NavBar = class NavBar extends NpaUiComponent{
	actionIdToItem = {};
	render(){
		let html = '';
		let style='padding-top: 0px;padding-bottom: 0px;padding-left: 5px;margin-bottom: 3px;';
		html += '<nav id="'+this.config.id+'" class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark" style="'+style+'">';
		html += '  <a class="navbar-brand" href="'+this.config.configuration.homeRef+'"><img src="'+this.config.configuration.icon+'" width="30">&nbsp;'+this.config.configuration.applicationName+'</a>';
		html += '  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
		html += '    <span class="navbar-toggler-icon"></span>';
		html += '  </button>';
		html += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
		html += '    <ul id="navbarMenu_'+this.config.id+'" class="navbar-nav me-auto mb-2 mb-lg-0">';
		html += '    </ul>';
		html += '  </div>';
		html += '</nav>';
		$('#'+this.id).html(html);
		var navBar = this;
		this.generateNavBarMenu(function(){
			$('.npa-navbar-menu').on('click',function(){
				let actionId = $(this).data('actionid');
				npaUi.fireEvent(actionId,navBar.actionIdToItem[actionId]);
			});
		});
	}
	generateNavBarMenu(then){
		if(typeof this.config.configuration.menus!='undefined'){
			for(var i=0;i<this.config.configuration.menus.length;i++){
				let menuConfig = this.config.configuration.menus[i];
				let menu = '';
				menu = this.generateMenu(menuConfig);
				$('#navbarMenu_'+this.config.id).append(menu);
			}
			then();
		}
	}
	generateMenu(menuConfig){
		let html = '';
		if(typeof menuConfig.items!='undefined'){
			html += '<li class="nav-item dropdown">';
			html += '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">';
			html += menuConfig.label;
			html += '</a>';
			html += '<ul id="'+menuConfig.id+'" class="dropdown-menu" data-bs-popper="static">';
			for(var i=0;i<menuConfig.items.length;i++){
				let item = menuConfig.items[i];
				if('separator'==item.type){
					html += '<li>';
					html += '<hr class="dropdown-divider">';
					html += '</li>';
				}else{
					this.actionIdToItem[item.actionId] = item;
					html += '<li id="'+item.id+'">';
					html += '<a class="dropdown-item npa-navbar-menu" href="#" data-actionid="'+item.actionId+'">';
					if(typeof item.icon!='undefined'){
						var title = '';
						if(typeof item.tooltip!='undefined'){
							title = ' title="'+item.tooltip+'"';
						}
						html += '<img src="'+item.icon+'" style="margin-right: 5px;" width="16"'+title+'>&nbsp;';
					}
					html += item.label;
					html += '</a>';
					html += '</li>';
				}
			}
			html += '</ul>';
			html += '</li>';
		}else{
			this.actionIdToItem[menuConfig.actionId] = menuConfig;
			html += '<li id="'+menuConfig.id+'" class="nav-item">';
			html += '<a class="nav-link npa-navbar-menu" href="#" aria-current="page" data-actionid="'+menuConfig.actionId+'">';
			if(typeof menuConfig.icon!='undefined'){
				var title = '';
				if(typeof menuConfig.tooltip!='undefined'){
					title = ' title="'+menuConfig.tooltip+'"';
				}
				html += '<img src="'+menuConfig.icon+'" style="margin-right: 5px;" width="16"'+title+'>&nbsp;';
			}
			html += menuConfig.label;
			html += '</a>';
			html += '</li>';
		}
		
		return html;
	}
}