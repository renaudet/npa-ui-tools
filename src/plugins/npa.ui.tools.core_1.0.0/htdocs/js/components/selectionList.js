/*
 * selectionList.js - NPA UI Tools Core component framework's SelectionList component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.SelectionList = class SelectionList extends NpaUiComponent{
	items = [];
	itemRenderer = null;
	selectedIndex = -1;
	initialize(then){
		if(this.getConfiguration().stylesheet){
			$.loadCss(this.getConfiguration().stylesheet,then);
		}else{
			$.loadCss('/uiTools/css/selectionList.css',then);
		}
		if(this.getConfiguration().renderer){
			this.itemRenderer = new window[this.getConfiguration().renderer.type](this.getConfiguration().renderer.configuration);
		}else{
			this.itemRenderer = new ItemRenderer({});
		}
	}
	fetchDataFromDatasource(then){
		let datasource = this.getConfiguration().datasource;
		if(typeof datasource!='undefined'){
			let type = 'local';
			let method = 'GET';
			let payload = {};
			if(typeof datasource.type!='undefined'){
				type = datasource.type;
			}
			if(typeof datasource.method!='undefined'){
				method = datasource.method;
			}
			if(typeof datasource.payload!='undefined'){
				payload = datasource.payload;
			}
			if('local'==type){
				console.log('SelectionList#fetchDataFromDatasource() - using local data from '+datasource.uri);
				var datatable = this;
				makeRESTCall(method,datasource.uri,payload,function(response){
					if(response.status==200){
						then(datatable.adaptFormat(response));
					}else{
						console.log(response);
					}
				},function(errorMsg){
					console.log(errorMsg);
				});
			}
			if('managed'==type){
				console.log('SelectionList#fetchDataFromDatasource() - using DataManager #'+datasource.manager);
				let dataManager = npaUi.getComponent(datasource.manager);
				if(typeof dataManager!='undefined'){
					dataManager.query(payload).then(then);
				}
			}
		}
	}
	render(){
		if(this.parentDiv().data('loaded')!='true'){
			let config = this.getConfiguration();
			let html = '';
			if(typeof config.header!='undefined'){
				html += '<div class="npa-selection-list-header">';
				html += '<table width="100%"><tr><td width="90%">'
				html += config.header.title;
				html += '</td>';
				html += '<td><img id="'+this.getId()+'_toggleFilterBtn" src="/uiTools/img/silk/layout_delete.png" class="npa-selection-list-filter-icon " title="Toggle filter..."></td>';
				html += '<tr id="'+this.getId()+'_filterSection" style="display: none;"><td><input id="'+this.getId()+'_filter" class="form-control form-control-sm"></td><td><button id="'+this.getId()+'_filterBtn" type="button" class="btn btn-sm btn-primary">Ok</button></td></tr>';
				html += '</tr></table>'
				html += '</div>';
			}
			html += '<ul id="'+this.getId()+'" class="list-group list-group-flush npa-selection-list">';
			html += '';
			html += '';
			html += '';
			html += '</ul>';
			this.parentDiv().html(html);
			var source = this;
			$('#'+this.getId()+'_toggleFilterBtn').on('click',function(){
				let trId = '#'+source.getId()+'_filterSection';
				if($(trId).css('display')=='none'){
					$(trId).show();
				}else{
					$(trId).hide();
				}
			});
			$('#'+this.getId()+'_filterBtn').on('click',function(){
				let filterStr = $('#'+source.getId()+'_filter').val();
				source.filter(filterStr);
			});
		}else{
			$('#'+this.getId()).empty();
		}
		var source = this;
		this.fetchDataFromDatasource(function(data){
			source.load(data);
		});
	}
	filter(filterStr){
		var normalizedFilterStr = filterStr?filterStr.toUpperCase():'';
		$('#'+this.getId()+' li').each(function(){
			var content = $(this).text().toUpperCase();
			if(content.indexOf(normalizedFilterStr)>=0){
				$(this).addClass('d-flex');
				$(this).show();
			}else{
				$(this).removeClass('d-flex');
				$(this).hide();
			}
		});
	}
	load(data){
		this.items = [];
		var source = this;
		data.map(function(item,index){
			source.addItem(item);
		});
		$('.'+this.getId()+'_selection_provider').off('.'+this.getId());
		$('.'+this.getId()+'_selection_provider').on('click.'+this.getId(),function(){
			source.select(parseInt($(this).data('index')));
		});
	}
	select(itemIndex){
		this.selectedIndex = itemIndex;
		if(this.selectedIndex<this.items.length){
			let selectedItem = this.items[this.selectedIndex];
			npaUi.fireEvent('select',{"source": this.getId(),"item": selectedItem});
		}
	}
	addItem(item){
		//let config = this.getConfiguration();
		let itemIndex = this.items.length;
		this.items.push(item);
		let html = '';
		html += '<li id="'+this.getId()+'_line_'+itemIndex+'" data-index="'+itemIndex+'" data-id="'+item.id+'" type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center '+this.getId()+'_selection_provider">';
		html += this.renderItem(item);
		html += '</li>';
		$('#'+this.getId()).append(html);
	}
	renderItem(item){
		return this.itemRenderer.render(item);
	}
	getSelectedItem(){
		if(this.selectedIndex>=0 && this.selectedIndex<this.items.length){
			return this.items[this.selectedIndex];
		}
		return null;
	}
	refresh(){
		this.render();
	}
}