/*
 * homePage.js - main javascript resource for the NPA Test Application Home Page
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
var menuHandler = {
	handleEvent: function(event){
		console.log('Event:');
		console.log(event);
		if('menu21'==event.actionId){
			queryDatasource();
		}
		if('menu23'==event.actionId){
			refreshUI();
		}
	}
}

var tableHandler = {
	onItemSelected: function(item){
		showInfo('Selected item: '+item.name);
		let editor = npaUi.getComponent('editor_01');
		editor.setText(item.code);
	},
	handleEvent: function(event){
		if('edit'==event.actionId){
			showInfo('Editing row '+event.item.name);
		}
		if('delete'==event.actionId){
			showWarning('Deleting row '+event.item.name);
		}
	}
}
 
$(document).ready(function(){
	npaUi.initialize(function(){
		npaUi.registerActionHandler('menu21',menuHandler);
		npaUi.registerActionHandler('menu23',menuHandler);
		npaUi.registerActionHandler('edit',tableHandler);
		npaUi.registerActionHandler('delete',tableHandler);
		npaUi.registerSelectionListener('table_01',tableHandler);
		npaUi.onComponentLoaded = onPageReady;
		npaUi.render();
	});
});

onPageReady = function(){
	showConfirm('Notifier component has been loaded!');
}

queryDatasource = function(){
	makeRESTCall('POST','/test/queryFragments',{},function(response){
		console.log(response);
	});
}

refreshUI = function(){
	npaUi.render();
}