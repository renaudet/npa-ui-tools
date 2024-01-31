/*
 * navBar.js - NPA UI Tools Core component framework's NavBar component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 

npaUiCore.NavBar = class NavBar extends NpaUiComponent{
	actionIdToItem = {};
	pluggableItems = {};
	initialize(then){
		$.loadCss('/uiTools/css/npaUiTheme.css',then);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		let style='padding-top: 0px;padding-bottom: 0px;padding-left: 5px;margin-bottom: 3px;';
		html += '<nav id="'+this.getId()+'" class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark" style="'+style+'">';
		html += '  <a class="navbar-brand" href="'+config.homeRef+'"><img src="'+config.icon+'" width="30">&nbsp;<span id="'+this.getId()+'_title">'+this.getLocalizedString(config.applicationName)+'</span></a>';
		html += '  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
		html += '    <span class="navbar-toggler-icon"></span>';
		html += '  </button>';
		html += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
		html += '    <ul id="navbarMenu_'+this.config.id+'" class="navbar-nav me-auto mb-2 mb-lg-0">';
		html += '    </ul>';
		html += '  </div>';
		html += '</nav>';
		this.parentDiv().html(html);
		var navBar = this;
		this.generateNavBarMenu(function(){
			for(var placeholderId in navBar.pluggableItems){
				let items = navBar.pluggableItems[placeholderId];
				for(var itemId in items){
					let item = items[itemId];
					let html = navBar.generateMenuItem(item);
					$('#'+placeholderId).replaceWith(html);
				}
			}
			$('.npa-navbar-menu').on('click.navbar',function(){
				let actionId = $(this).data('actionid');
				let item = navBar.actionIdToItem[actionId];
				if('redirect'==item.actionId){
					npaUi.fireEvent('redirect',item);
				}else
					npaUi.fireEvent(actionId,item);
			});
		});
	}
	generateNavBarMenu(then){
		let config = this.getConfiguration();
		let navbar = this;
		if(typeof config.providerUrl!='undefined'){
			makeRESTCall('GET',config.providerUrl,{},function(response){
				if(response.status==200){
					navbar.generateUpperMenus(response.data);
				}
				navbar.generateUpperMenus(config.menus);
				then();
			},function(errorMsg){
				console.log(errorMsg);
				navbar.generateUpperMenus(config.menus);
				then();
			});
		}else{
			this.generateUpperMenus(config.menus);
			then();
		}
	}
	generateUpperMenus(upperMenuList){
		if(typeof upperMenuList!='undefined' && upperMenuList!=null){
			for(var i=0;i<upperMenuList.length;i++){
				let menuConfig = upperMenuList[i];
				$('#navbarMenu_'+this.config.id).append(this.generateMenu(menuConfig));
			}
		}
	}
	generateMenu(menuConfig){
		let html = '';
		if(typeof menuConfig.type!='undefined' && 'placeholder'==menuConfig.type){
			if(typeof this.pluggableItems[menuConfig.id]=='undefined'){
				this.pluggableItems[menuConfig.id] = {};
			}
			for(var i=0;i<menuConfig.items.length;i++){
				let item = menuConfig.items[i];
				this.pluggableItems[menuConfig.id][item.id] = item;
			}
		}else{
			if(typeof menuConfig.items!='undefined'){
				html += '<li class="nav-item dropdown">';
				html += '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">';
				html += this.getLocalizedString(menuConfig.label);
				html += '</a>';
				html += '<ul id="'+menuConfig.id+'" class="dropdown-menu" data-bs-popper="static">';
				for(var i=0;i<menuConfig.items.length;i++){
					let item = menuConfig.items[i];
					html += this.generateMenuItem(item);
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
						title = ' title="'+this.getLocalizedString(menuConfig.tooltip)+'"';
					}
					html += '<img src="'+menuConfig.icon+'" style="margin-right: 5px;" width="16"'+title+'>&nbsp;';
				}
				html += this.getLocalizedString(menuConfig.label);
				html += '</a>';
				html += '</li>';
			}
		}
		return html;
	}
	generateMenuItem(item){
		let html = '';
		if('separator'==item.type){
			html += '<li>';
			html += '<hr class="dropdown-divider">';
			html += '</li>';
		}else
		if('placeholder'==item.type){
			html += '<li id="'+item.id+'"></li>';
		}else
		if('dynamic'==item.type){
			html += '<li id="'+item.id+'"></li>';
			this.dynamicalyLoadMenuItems(item);
		}else{
			html = this.generateClassicMenuItem(item);
		}
		return html;
	}
	dynamicalyLoadMenuItems(item){
		let navBar = this;
		makeRESTCall('GET',item.uri,{},function(response){
			if(response.status==200){
				let menuContributions = response.data;
				let html = '';
				for(var i=0;i<menuContributions.length;i++){
					let menuItem = menuContributions[i];
					html += navBar.generateMenuItem(menuItem);
				}
				$('#'+item.id).replaceWith(html);
				$('.npa-navbar-menu').off('.navbar');
				$('.npa-navbar-menu').on('click.navbar',function(){
					let actionId = $(this).data('actionid');
					let item = navBar.actionIdToItem[actionId];
					if('redirect'==item.actionId){
						npaUi.fireEvent('redirect',item);
					}else
						npaUi.fireEvent(actionId,item);
				});
			}
		},function(error){
			console.log('navBar#dynamicalyLoadMenuItems()');
			console.log(item);
			console.log(error);
		});
	}
	generateClassicMenuItem(item){
		let html = '';
		let actionId = item.actionId;
		if('redirect'==actionId){
			actionId = item.id;
		}
		this.actionIdToItem[actionId] = item;
		html += '<li id="'+item.id+'">';
		html += '<a class="dropdown-item npa-navbar-menu" href="#" data-actionid="'+actionId+'">';
		if(typeof item.icon!='undefined'){
			var title = '';
			if(typeof item.tooltip!='undefined'){
				title = ' title="'+this.getLocalizedString(item.tooltip)+'"';
			}
			html += '<img src="'+item.icon+'" style="margin-right: 5px;" width="16"'+title+'>&nbsp;';
		}
		html += this.getLocalizedString(item.label);
		html += '</a>';
		html += '</li>';
		return html;
	}
}