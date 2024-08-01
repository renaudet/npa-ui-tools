/*
 * htmlImport.js - NPA UI Tools Core component framework's HTML Import component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.HtmlImport = class HtmlImport extends NpaUiComponent{
	initialize(then){
		if(this.getConfiguration().stylesheet){
			$.loadCss(this.getConfiguration().stylesheet,then);
		}else{
			then();
		}
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let pageUrl = config.url;
			let htmlImport = this;
			$.ajax({
		        url: pageUrl,
		        dataType: "html",
		        success: function(){},
		        async: true
		    }).done(function(htmlFragment){
				htmlImport.parentDiv().append(htmlFragment);
				//htmlImport.parentDiv().data('loaded') = 'true';
			});
		}
	}
}