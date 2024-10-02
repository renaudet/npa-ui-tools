/*
 * notifier.js - NPA UI Tools Core component framework's Notifier component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
var notifCount = 0;
function createNotification(type,message,data=[]){
	var notifId = 'uiToolsNotification_'+(notifCount++);
	var title = npaUi.getLocalizedString('@notifier.title');
	var msgType = npaUi.getLocalizedString('@notifier.info');
	var icon = '/uiTools/img/info.png';
	var theme = ' text-bg-info';
	var autoHide = 'false';
	var autoHideDelay = 4000;
	if('error'==type){
		msgType = npaUi.getLocalizedString('@notifier.error');
		icon = '/uiTools/img/error.png';
		theme = ' text-bg-danger';
	}
	if('warning'==type){
		msgType = npaUi.getLocalizedString('@notifier.warning');
		icon = '/uiTools/img/warning.png';
		theme = ' text-bg-warning';
	}
	if('confirm'==type){
		msgType = npaUi.getLocalizedString('@notifier.confirm');
		icon = '/uiTools/img/silk/accept.png';
		theme = ' text-bg-success';
		autoHide = 'true';
	}
	if('flash'==type){
		msgType = npaUi.getLocalizedString('@notifier.flash');
		icon = '/uiTools/img/silk/flag_green.png';
		theme = ' text-bg-success';
		autoHide = 'true';
		autoHideDelay = 2000;
	}
	var html = '';
	html += '<div id="'+notifId+'" class="toast uiToolsNotification" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="'+autoHide+'"'+(autoHide?' data-bs-delay="'+autoHideDelay+'"':'')+'>';
	html += '  <div class="toast-header'+theme+'">';
	html += '    <img src="'+icon+'" class="rounded me-2" width="16">';
	html += '    <strong class="me-auto">'+title+'</strong>';
	html += '    <small>'+msgType+'</small>';
	html += '    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>';
	html += '  </div>';
	html += '  <div class="toast-body" style="background-color: #fff;max-height: 800px;overflow: auto;">';
	if(typeof message=='object'){
		html += JSON.stringify(message,null,'\t').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;');
	}else{
		html += npaUi.getLocalizedString(message,data);
	}
	html += '  </div>';
	html += '</div>';
	$('#uiToolsNotifications').append(html);
	return notifId;
}

function showNotification(notificationType,msg,data=[]){
	const toastId = createNotification(notificationType,msg,data);
	const toastDiv = document.getElementById(toastId);
	const toastObj = bootstrap.Toast.getOrCreateInstance(toastDiv);
	$(document).on('hidden.bs.toast','#'+toastId,function(){
		$('#'+toastId).remove();
	});
	toastObj.show();
}

function showInfo(msg,data=[]){
	showNotification('info',msg,data);
}

function showWarning(msg,data=[]){
	showNotification('warning',msg,data);
}

function showError(msg,data=[]){
	showNotification('error',msg,data);
}

function showConfirm(msg,data=[]){
	showNotification('confirm',msg,data);
}

function flash(msg,data=[]){
	showNotification('flash',msg,data);
}
 
npaUiCore.Notifier = class Notifier extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/notifier.css',then);
	}
	render(){
		let html = '';
		html += '<div id="uiToolsNotifications" class="toast-container top-0 end-0 p-4">';
		html += '</div>';
		this.parentDiv().html(html);
	}
}