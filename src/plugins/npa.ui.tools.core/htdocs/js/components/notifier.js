/*
 * notifier.js - NPA UI Tools Core component framework's Notifier component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
var notifCount = 0;
function createNotification(type,message){
	var notifId = 'uiToolsNotification_'+(notifCount++);
	var title = 'Notification';
	var msgType = 'Information';
	var icon = '/uiTools/img/info.png';
	var theme = ' text-bg-info';
	var autoHide = 'false';
	if('error'==type){
		msgType = 'Error';
		icon = '/uiTools/img/error.png';
		theme = ' text-bg-danger';
	}
	if('warning'==type){
		msgType = 'Warning';
		icon = '/uiTools/img/warning.png';
		theme = ' text-bg-warning';
	}
	if('confirm'==type){
		msgType = 'Confirmation';
		icon = '/uiTools/img/silk/accept.png';
		theme = ' text-bg-success';
		autoHide = 'true';
	}
	var html = '';
	html += '<div id="'+notifId+'" class="toast uiToolsNotification" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="'+autoHide+'"'+(autoHide?' data-bs-delay="4000"':'')+'>';
	html += '  <div class="toast-header'+theme+'">';
	html += '    <img src="'+icon+'" class="rounded me-2" width="16">';
	html += '    <strong class="me-auto">'+title+'</strong>';
	html += '    <small>'+msgType+'</small>';
	html += '    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>';
	html += '  </div>';
	html += '  <div class="toast-body" style="background-color: #fff;">';
	html += message;
	html += '  </div>';
	html += '</div>';
	$('#uiToolsNotifications').append(html);
	return notifId;
}

function showNotification(notificationType,msg){
	const toastId = createNotification(notificationType,msg);
	const toastDiv = document.getElementById(toastId);
	const toastObj = bootstrap.Toast.getOrCreateInstance(toastDiv);
	$(document).on('hidden.bs.toast','#'+toastId,function(){
		$('#'+toastId).remove();
	});
	toastObj.show();
}

function showInfo(msg){
	showNotification('info',msg);
}

function showWarning(msg){
	showNotification('warning',msg);
}

function showError(msg){
	showNotification('error',msg);
}

function showConfirm(msg){
	showNotification('confirm',msg);
}
 
npaUiCore.Notifier = class Notifier extends NpaUiComponent{
	render(){
		let html = '';
		html += '<div id="uiToolsNotifications" class="toast-container top-0 end-0 p-3">';
		html += '</div>';
		$('#'+this.id).html(html);
	}
}