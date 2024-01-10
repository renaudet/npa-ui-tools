/*
 * homePage.js - main javascript resource for the NPA Test Application Home Page
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
var selectedRecord = null;
 
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
			insertNewRecord();
		}
		if('editSource'==event.actionId){
			let editor = npaUi.getComponent('editor_01');
			editor.setReadonly(false);
			editor.setEnabled('saveSource',true);
		}
		if('saveSource'==event.actionId){
			let editor = npaUi.getComponent('editor_01');
			
			let dataManager = npaUi.getComponent('manager_01');
			selectedRecord.customization = editor.getText();
			dataManager.update(selectedRecord).then(function(data){
				selectedRecord = data;
				npaUi.getComponent('table_01').render();
				editor.setEnabled('editSource',true);
				editor.setReadonly(true);
				editor.setEnabled('saveSource',false);
			}).onError(function(errorMsg){
				showError(errorMsg);
			});
		}
	}
}

var tableHandler = {
	onItemSelected: function(item){
		//showInfo('Selected item: '+item.name);
		selectedRecord = item;
		let editor = npaUi.getComponent('editor_01');
		editor.setReadonly(true);
		editor.setText(item.customization);
		editor.setEnabled('editSource',true);
		editor.setEnabled('saveSource',false);
		npaUi.getComponent('toolbar_01').setEnabled('print',true);
	},
	handleEvent: function(event){
		if('edit'==event.actionId){
			editRecord(event.item);
		}
		if('delete'==event.actionId){
			deleteRecord(event.item);
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
			npaUi.registerActionHandler('insert',actionHandler);
			npaUi.registerActionHandler('editSource',actionHandler);
			npaUi.registerActionHandler('saveSource',actionHandler);
			npaUi.registerSelectionListener('table_01',tableHandler);
			npaUi.onComponentLoaded = onPageReady;
			npaUi.render();
		});
	});
});

onPageReady = function(){
	npaUi.getComponent('toolbar_01').setEnabled('print',false);
	let editor = npaUi.getComponent('editor_01');
	editor.setText('');
	editor.setReadonly(true);
	editor.setEnabled('editSource',false);
	editor.setEnabled('saveSource',false);
}

insertNewRecord = function(){
	let form = npaUi.getComponent('form_01');
	form.setData({});
	form.setEditMode(true);
	let dialog = npaUi.getComponent('dialog_01');
	dialog.onClose(function(){
		let dataManager = npaUi.getComponent('manager_01');
		let newRecord = form.getData();
		newRecord.customization = '//no customization yet for '+newRecord.name;
		dataManager.create(newRecord).then(function(data){
			console.log(data);
			npaUi.getComponent('table_01').render();
			tableHandler.onItemSelected(data);
			showConfirm('New record created with ID #'+data.id);
		}).onError(function(errorMsg){
			showError(errorMsg);
		});
	});
	dialog.open();
}

editRecord = function(record){
	let form = npaUi.getComponent('form_01');
	form.setData(record);
	form.setEditMode(true);
	let dialog = npaUi.getComponent('dialog_01');
	dialog.onClose(function(){
		let dataManager = npaUi.getComponent('manager_01');
		let updatedRecord = form.getData();
		dataManager.update(updatedRecord).then(function(data){
			selectedRecord = data;
			npaUi.getComponent('table_01').render();
		}).onError(function(errorMsg){
			showError(errorMsg);
		});
	});
	dialog.open();
}

deleteRecord = function(record){
	if(confirm('Are you sure you want to delete record "'+record.name+'"?')){
		let dataManager = npaUi.getComponent('manager_01');
		dataManager.delete(record).then(function(data){
			selectedRecord = null;
			npaUi.getComponent('table_01').render();
			onPageReady();
		}).onError(function(errorMsg){
			showError(errorMsg);
		});
	}
}

queryDatasource = function(){
	let dataManager = npaUi.getComponent('manager_01');
	dataManager.query().then(function(data){
		//console.log(data);
		flash('Datasource query returned '+data.length+' records');
	}).onError(function(errorMsg){
		showError(errorMsg);
	});
}

refreshUI = function(){
	npaUi.render();
	npaUi.getComponent('editor_01').setEnabled('new',true);
}