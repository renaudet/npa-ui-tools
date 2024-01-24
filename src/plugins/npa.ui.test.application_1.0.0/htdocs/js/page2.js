/*
 * page2.js - main javascript resource for the NPA Test Application Page 2
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
var actionHandler = {
	handleEvent: function(event){
		if('save'==event.actionId){
			let form = npaUi.getComponent('form_01');
			let toolbar = npaUi.getComponent('toolbar_01');
			let dataManager = npaUi.getComponent('manager_01');
			let list = npaUi.getComponent('selectionList_01');
			if(form.isValid()){
				let updatedRecord = form.getData();
				dataManager.update(updatedRecord).then(function(data){
					form.setData(data);
					toolbar.setEnabled('save',false);
					toolbar.setEnabled('edit',true);
					form.setEditMode(false);
					list.refresh();
				}).onError(function(errorMsg){
					showError(errorMsg);
				});
			}
		}
	}
}

var selectionHandler = {
	onItemSelected: function(item){
	}
}
 
$(document).ready(function(){
	npaUi.loadConfigFrom('/static/config/globalConfig.json',function(){
		npaUi.initialize(function(){
			npaUi.registerActionHandler('save',actionHandler);
			//npaUi.registerSelectionListener('selectionList_01',selectionHandler);
			//npaUi.onComponentLoaded = onPageReady;
			npaUi.on('delete',deleteRecord);
			npaUi.on('displayMessage',displayMessage);
			npaUi.render();
		});
	});
});

deleteRecord = function(){
	let list = npaUi.getComponent('selectionList_01');
	let dataManager = npaUi.getComponent('manager_01');
	if(confirm(npaUi.getLocalizedString('@action.delete.record.confirmation',[list.getSelectedItem().name]))){
		dataManager.delete(list.getSelectedItem()).then(function(data){
			list.select(-1);
			list.refresh();
			let form = npaUi.getComponent('form_01');
			let toolbar = npaUi.getComponent('toolbar_01');
			form.setData({});
			form.setEditMode(false);
			toolbar.setEnabled('save',false);
			toolbar.setEnabled('edit',false);
			toolbar.setEnabled('delete',false);
		}).onError(function(errorMsg){
			showError(errorMsg);
		});
	}
}

onPageReady = function(){
}

refreshUI = function(){
	npaUi.render();
}

displayMessage = function(){
	makeRESTCall('GET','/i18n/localize?ref=test.application.title&values=&locale='+navigator.language,{},function(response){
		console.log(response);
		flash(response.text);
	});
}