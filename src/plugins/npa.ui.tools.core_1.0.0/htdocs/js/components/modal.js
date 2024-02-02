/*
 * modal.js - NPA UI Tools Core component framework's ModalDialog component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.ModalDialog = class ModalDialog extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/modal.css',then);
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let size = '';
			if('XXL'==config.size){
				size = ' modal-xl';
			}
			if('XL'==config.size){
				size = ' modal-lg';
			}
			if('S'==config.size){
				size = ' modal-sm';
			}
			let child = null;
			if($('#'+this.parentDivId+' div').length>0){
				 child = $('#'+this.parentDivId+' div').first().detach();
			}
			let html = '';
			let title = '';
			if(typeof config.title!='undefined' && config.title.length>0){
				title = this.getLocalizedString(config.title);
			}
			html += '<div class="modal fade" id="'+this.getId()+'" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="'+config.title+'" aria-hidden="true">';
			html += '  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable'+size+'">';
			html += '    <div class="modal-content">';
			html += '      <div id="'+this.getId()+'_header" class="modal-header modal-dialog-header">';
			html += '        <h1 class="modal-title fs-5" id="'+this.getId()+'_title">'+title+'</h1>';
			html += '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
			html += '      </div>';
			html += '      <div id="'+this.getId()+'_body" class="modal-body">';
			html += '      </div>';
			html += '      <div id="'+this.getId()+'_footer" class="modal-footer">';
			if(typeof config.buttons!='undefined'){
				for(var i=0;i<config.buttons.length;i++){
					let button = config.buttons[i];
					if('close'==button.action){
						html += '<button id="'+this.getId()+'_closeBtn" type="button" class="btn btn-primary" data-bs-dismiss="modal">'+this.getLocalizedString(button.label)+'</button>';
					}
					if('cancel'==button.action){
						html += '<button id="'+this.getId()+'_cancelBtn" type="button" class="btn btn-warning" data-bs-dismiss="modal">'+this.getLocalizedString(button.label)+'</button>';
					}
				}
			}else{
				html += '        <button id="'+this.getId()+'_closeBtn" type="button" class="btn btn-primary" data-bs-dismiss="modal">'+this.getLocalizedString('@modal.button.close')+'Close</button>';
			}
			html += '      </div>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';
			
			this.parentDiv().html(html);
			if(child){
				$('#'+this.getId()+'_body').append(child);
			}
		}
	}
	setBody(html){
		$('#'+this.getId()+'_body').html(html);
	}
	setTitle(title){
		$('#'+this.getId()+'_title').html(this.getLocalizedString(title));
	}
	open(){
		const myModal = new bootstrap.Modal(document.getElementById(this.getId()));
		myModal.show();
	}
	onClose(callback){
		$('#'+this.getId()+'_closeBtn').off('.'+this.getId());
		$('#'+this.getId()+'_closeBtn').on('click.'+this.getId(),callback);
	}
	onCancel(callback){
		$('#'+this.getId()+'_cancelBtn').off('.'+this.getId());
		$('#'+this.getId()+'_cancelBtn').on('click.'+this.getId(),callback);
	}
}