/*
 * datatable.js - NPA UI Tools Core component framework's Datatable component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Datatable = class Datatable extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/npaUiTheme.css',then);
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
				makeRESTCall(method,datasource.uri,payload,function(response){
					if(response.status==200){
						then(response.data);
					}else{
						console.log(response);
					}
				},function(errorMsg){
					console.log(errorMsg);
				});
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
			return inputData;
		}
		console.log('datatable.js#adaptFormat(inputData) - no adapter configured for datasource type '+dsType);
		return [];
	}
	render(){
		let config = this.getConfiguration();
		if($('#'+this.getId()+'_table').length==0){
			let html = '';
			html += '<table id="'+this.getId()+'_table" class="table table-striped table-hover table-sm">';
			html += '  <thead class="table-dark">';
			html += '    <tr>';
			for(var i=0;i<config.columns.length;i++){
				let column = config.columns[i];
				html += '<th scope="col">';
				html += column.label;
				html += '</th>';
			}
			
			html += '    </tr>';
			html += '  </thead>';
			html += '  <tbody class="table-group-divider">';
			html += '  </tbody>';
			html += '</div>';
			this.parentDiv().html(html);
		}else{
			$('#'+this.getId()+'_table tbody').empty();
		}
		var datatable = this;
		this.fetchDataFromDatasource(function(data){
			$('.'+datatable.getId()+'_row').off('.'+datatable.getId());
			datatable.adaptFormat(data).map(function(item,index){
				let row = '';
				row += '<tr data-index="'+index+'" class="'+datatable.getId()+'_row">';
				row += '';
				for(var i=0;i<config.columns.length;i++){
					let column = config.columns[i];
					row += '<td>';
					if(typeof column.field!='undefined'){
						let value = item[column.field];
						row += value;
					}
					row += '</td>';
				}
				row += '</tr>';
				$('#'+datatable.getId()+'_table tbody').append(row);
			});
			$('.'+datatable.getId()+'_row').on('click.'+datatable.getId(),function(){
				let rowIndex = $(this).data('index');
				npaUi.fireEvent('select',{"source": datatable.getId(),"item": data[rowIndex]});
			});
		});
	}
}