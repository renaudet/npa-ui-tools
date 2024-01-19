/*
 * datatable.js - NPA UI Tools Core component framework's Datatable component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Datatable = class Datatable extends NpaUiComponent{
	itemSorter = null;
	initialize(then){
		$.loadCss('/uiTools/css/datatable.css',then);
		if(this.getConfiguration().sorter){
			this.itemSorter = new window[this.getConfiguration().sorter.type](this.getConfiguration().sorter);
		}else{
			this.itemSorter = new ItemSorter({});
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
				console.log('Datatable#fetchDataFromDatasource() - using local data from '+datasource.uri);
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
				console.log('Datatable#fetchDataFromDatasource() - using DataManager #'+datasource.manager);
				let dataManager = npaUi.getComponent(datasource.manager);
				if(typeof dataManager!='undefined'){
					dataManager.query(payload).then(then);
				}
			}
		}
	}
	adaptFormat(inputData){
		let datasource = this.getConfiguration().datasource;
		let dsType = 'local';
		if(typeof datasource.type!='undefined'){
			dsType = datasource.type;
		}
		if('local'==dsType){
			if(datasource.adapter){
				var data = [];
				var toEval = 'data = '+datasource.adapter.replace(/@/g,'inputData')+';'
				try{
					eval(toEval);
					return data;
				}catch(t){
					console.log('datatable.js#adaptFormat(inputData) - exception evaluating adapter for datasource');
					return [];
				}
			}else{
				return inputData;
			}
		}
		console.log('datatable.js#adaptFormat(inputData) - no adapter configured for datasource type '+dsType);
		return [];
	}
	render(){
		let config = this.getConfiguration();
		if($('#'+this.getId()+'_table').length==0){
			let html = '';
			html += '<div id="'+this.getId()+'" style="max-height: '+config.maxHeight+'px;overflow: auto;">';
			html += '<table id="'+this.getId()+'_table" class="table table-striped table-hover table-sm">';
			html += '  <thead class="table-dark">';
			html += '    <tr>';
			for(var i=0;i<config.columns.length;i++){
				let column = config.columns[i];
				let widthExpr = '';
				if(typeof column.width!='undefined'){
					widthExpr = 'width: '+column.width+'px;'
				}
				if(typeof column.label!='undefined'){
					html += '<th scope="col" style="position: sticky; top: 0;z-index: 1;'+widthExpr+'">';
					html += this.getLocalizedString(column.label);
					html += '</th>';
				}else{
					html += '<th scope="col" style="position: sticky; top: 0;z-index: 1;'+widthExpr+'">';
					html += typeof column.field!='undefined'?column.field:'';
					html += '</th>';
				}
			}
			
			html += '    </tr>';
			html += '  </thead>';
			html += '  <tbody class="table-group-divider">';
			html += '  </tbody>';
			html += '</table>';
			html += '</div>';
			this.parentDiv().html(html);
		}
		this.refresh();
	}
	refresh(){
		console.log('Datatable#refresh()');
		let config = this.getConfiguration();
		$('#'+this.getId()+'_table tbody').empty();
		var datatable = this;
		this.fetchDataFromDatasource(function(data){
			let sortedData = datatable.itemSorter.sort(data);
			$('.'+datatable.getId()+'_row').off('.'+datatable.getId());
			$('.datatableAction').off('.'+datatable.getId());
			sortedData.map(function(item,index){
				let row = '';
				row += '<tr data-index="'+index+'" class="'+datatable.getId()+'_row">';
				row += '';
				for(var i=0;i<config.columns.length;i++){
					let column = config.columns[i];
					row += datatable.renderColumn(item,index,column);
				}
				row += '</tr>';
				$('#'+datatable.getId()+'_table tbody').append(row);
			});
			$('.'+datatable.getId()+'_row').on('click.'+datatable.getId(),function(){
				let rowIndex = $(this).data('index');
				npaUi.fireEvent('select',{"source": datatable.getId(),"item": sortedData[rowIndex]});
			});
			$('.datatableAction').on('click.'+datatable.getId(),function(){
				let rowIndex = $(this).data('index');
				let actionId = $(this).data('action');
				npaUi.fireEvent(actionId,{"source": datatable.getId(),"actionId": actionId,"item": sortedData[rowIndex]});
			});
		});
	}
	renderColumn(item,index,column){
		let html = '';
		html += '<td>';
		if(typeof column.type!='undefined'){
			if('rowActions'==column.type){
				for(var j=0;j<column.actions.length;j++){
					let actionDef = column.actions[j];
					if(j>0){
						html += '&nbsp;';
					}
					html += '<img src="'+actionDef.icon+'" class="datatableAction" title="'+this.getLocalizedString(actionDef.label)+'" data-index="'+index+'" data-action="'+actionDef.actionId+'">';
				}
			}else{
				if('boolean'==column.type){
					let booleanValue = item[column.field];
					if(booleanValue){
						html += '<img src="/uiTools/img/silk/accept.png">';
					}else{
						html += '<img src="/uiTools/img/silk/cross.png">';
					}
				}else
				if('number'==column.type){
					let numberValue = item[column.field];
					let leftMarge = 15;
					if(typeof column.leftMarge!='undefined'){
						leftMarge = column.leftMarge;
					}
					html += '<div style="text-align: right;padding-right: '+leftMarge+'px;">'+numberValue+'</div>';
				}else
				if('color'==column.type){
					let colorValue = item[column.field];
					html += '<span class="column-type-color" style="background-color: '+colorValue+';">&nbsp;</span>';
				}else{
					html += '?';
				}
			}
		}else
		if(typeof column.field!='undefined'){
			let value = item[column.field];
			html += value;
		}else
		if(typeof column.renderer!='undefined'){
			let toEval = 'html += '+column.renderer.replace(/@/g,'item').replace(/{/g,'\'+').replace(/}/g,'+\'')+';';
			try{
				eval(toEval);
			}catch(evalException){
				console.log(toEval);
				console.log(evalException);
				html += '???';
			}
		}else{
			html += '?';
		}
		html += '</td>';
		return html;
	}
}