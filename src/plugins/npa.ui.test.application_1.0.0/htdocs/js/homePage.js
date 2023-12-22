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

var actionHandler = {
	handleEvent: function(event){
		if('insert'==event.actionId){
			let form = npaUi.getComponent('form_01');
			form.setEditMode(true);
			let dialog = npaUi.getComponent('dialog_01');
			dialog.onClose(function(){
				showConfirm('ModalDialog was closed!');
			});
			dialog.open();
		}
	}
}

var tableHandler = {
	onItemSelected: function(item){
		showInfo('Selected item: '+item.name);
		let editor = npaUi.getComponent('editor_01');
		editor.setText(item.code);
		npaUi.getComponent('toolbar_01').setEnabled('delete',true);
	},
	handleEvent: function(event){
		if('edit'==event.actionId){
			showInfo('Editing row '+event.item.name);
		}
		if('delete'==event.actionId){
			showWarning('Deleting row '+event.item.name);
		}
		if('new'==event.actionId){
			let dataManager = npaUi.getComponent('manager_01');
			let newRecord = {};
			newRecord.category = 'NPA';
			newRecord.name = 'Test NPA';
			newRecord.version = '0.1.0';
			newRecord.code = '//Test NPA'
			dataManager.create(newRecord).then(function(data){
				console.log(data);
				refreshUI();
			});
		}
	}
}
 
$(document).ready(function(){
	npaUi.loadConfigFrom('/static/config/globalConfig.json',function(){
		npaUi.initialize(function(){
			npaUi.registerActionHandler('menu21',menuHandler);
			npaUi.registerActionHandler('menu23',menuHandler);
			npaUi.registerActionHandler('edit',tableHandler);
			npaUi.registerActionHandler('delete',tableHandler);
			npaUi.registerActionHandler('new',tableHandler);
			npaUi.registerActionHandler('insert',actionHandler);
			npaUi.registerSelectionListener('table_01',tableHandler);
			npaUi.onComponentLoaded = onPageReady;
			npaUi.render();
		});
	});
});

onPageReady = function(){
	//showConfirm('Notifier component has been loaded!');
	npaUi.getComponent('toolbar_01').setEnabled('delete',false);
	npaUi.getComponent('editor_01').setEnabled('new',false);
}

queryDatasource = function(){
	let dataManager = npaUi.getComponent('manager_01');
	dataManager.query().then(function(data){
		console.log(data);
	});
}

refreshUI = function(){
	npaUi.render();
	npaUi.getComponent('editor_01').setEnabled('new',true);
}