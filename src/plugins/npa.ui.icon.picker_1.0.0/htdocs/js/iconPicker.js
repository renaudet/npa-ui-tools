/*
 * iconPicker.js - NPA UI Tools Icon Picker component
 * Copyright 2026 Nicolas Renaudet - All rights reserved
 *
 * Configuration options:
 * {
 *   "value": "/npaIconPicker/img/silk/application.png", // Initial icon path (optional)
 *   "previewSize": 16,                                   // Preview size in pixels: 16 (default) or 32
 *   "placeholder": "@my.i18n.key"                        // Placeholder of the path field (optional)
 * }
 */

const ICON_PICKER_BASE_URI = '/npaIconPicker';
const ICON_PICKER_IMG_URI = ICON_PICKER_BASE_URI+'/img/';
const ICON_PICKER_API_URI = '/npaIconPickerApis/icons';
const ICON_PICKER_FOLDER_ICON = '/uiTools/img/silk/folder.png';
const ICON_PICKER_UP_ICON = '/uiTools/img/silk/arrow_up.png';

if(typeof npaIconPicker=='undefined'){
	npaIconPicker = {};
}

npaIconPicker.IconPicker = class IconPicker extends NpaUiComponent{
	value = '';
	selectedValue = '';
	currentPath = '';
	currentListing = null;
	requestCounter = 0;
	changeListeners = [];
	dialogReady = false;

	initialize(then){
		$.loadCss(ICON_PICKER_BASE_URI+'/css/iconPicker.css',then);
	}

	render(then){
		if(this.parentDiv().data('loaded')!='true'){
			this.parentDiv().data('loaded','true');
			let config = this.getConfiguration() || {};
			let size = (config.previewSize==32)?32:16;
			let placeholder = this.getLocalizedString(config.placeholder?config.placeholder:'@npa.ui.icon.picker.placeholder');
			let id = this.getId();
			let html = '';
			html += '<div class="input-group npa-icon-picker">';
			html += '  <span class="input-group-text npa-icon-picker-preview"><img id="'+id+'_preview" width="'+size+'" height="'+size+'" alt=""></span>';
			html += '  <input id="'+id+'_path" type="text" class="form-control" readonly>';
			html += '  <button id="'+id+'_clear" type="button" class="btn btn-outline-secondary" title=""><img src="/uiTools/img/silk/cross.png" width="16" height="16" alt=""></button>';
			html += '  <button id="'+id+'_browse" type="button" class="btn btn-primary"></button>';
			html += '</div>';
			this.parentDiv().html(html);
			$('#'+id+'_path').attr('placeholder',this.decode(placeholder));
			$('#'+id+'_browse').html(this.getLocalizedString('@npa.ui.icon.picker.button.browse'));
			$('#'+id+'_clear').attr('title',this.decode(this.getLocalizedString('@npa.ui.icon.picker.button.clear')));
			let picker = this;
			$('#'+id+'_browse').on('click.'+id,function(){
				picker.open();
			});
			$('#'+id+'_clear').on('click.'+id,function(){
				picker.setValue('',true);
			});
			this.setValue(config.value?config.value:'',false);
		}
		then();
	}

	/* HTML entities declared in the locale files must be decoded for attributes */
	decode(text){
		return $('<div />').html(text).text();
	}

	getValue(){
		return this.value;
	}

	setValue(value,notify=false){
		this.value = (typeof value=='string')?value:'';
		let id = this.getId();
		$('#'+id+'_path').val(this.value);
		$('#'+id+'_path').attr('title',this.value);
		if(this.value.length>0){
			$('#'+id+'_preview').attr('src',this.value).css('visibility','visible');
		}else{
			$('#'+id+'_preview').removeAttr('src').css('visibility','hidden');
		}
		if(notify){
			for(var i=0;i<this.changeListeners.length;i++){
				try{
					this.changeListeners[i](this.value);
				}catch(t){
					console.log(t);
				}
			}
		}
	}

	onChange(callback){
		this.changeListeners.push(callback);
	}

	setEnabled(enabled){
		let id = this.getId();
		$('#'+id+'_browse').prop('disabled',!enabled);
		$('#'+id+'_clear').prop('disabled',!enabled);
	}

	// ---- selection dialog ----

	dialogId(){
		return this.getId()+'_iconPickerDialog';
	}

	buildDialog(){
		let id = this.getId();
		let dlgId = this.dialogId();
		$('#'+dlgId).remove();
		let html = '';
		html += '<div class="modal fade npa-icon-picker-dialog" id="'+dlgId+'" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-hidden="true">';
		html += '  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">';
		html += '    <div class="modal-content">';
		html += '      <div class="modal-header modal-dialog-header">';
		html += '        <h1 class="modal-title fs-5" id="'+dlgId+'_title"></h1>';
		html += '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
		html += '      </div>';
		html += '      <div class="modal-body">';
		html += '        <div class="npa-icon-picker-toolbar">';
		html += '          <button id="'+dlgId+'_up" type="button" class="btn btn-sm btn-outline-secondary"><img src="'+ICON_PICKER_UP_ICON+'" width="16" height="16" alt=""></button>';
		html += '          <div id="'+dlgId+'_crumbs" class="npa-icon-picker-crumbs"></div>';
		html += '          <input id="'+dlgId+'_filter" type="text" class="form-control form-control-sm npa-icon-picker-filter">';
		html += '        </div>';
		html += '        <div id="'+dlgId+'_grid" class="npa-icon-picker-grid"></div>';
		html += '      </div>';
		html += '      <div class="modal-footer npa-icon-picker-footer">';
		html += '        <span class="npa-icon-picker-selection"><span id="'+dlgId+'_selLabel"></span> <img id="'+dlgId+'_selPreview" width="16" height="16" alt=""> <code id="'+dlgId+'_selPath"></code></span>';
		html += '        <button id="'+dlgId+'_cancel" type="button" class="btn btn-warning" data-bs-dismiss="modal"></button>';
		html += '        <button id="'+dlgId+'_ok" type="button" class="btn btn-primary"></button>';
		html += '      </div>';
		html += '    </div>';
		html += '  </div>';
		html += '</div>';
		$('body').append(html);
		$('#'+dlgId+'_title').html(this.getLocalizedString('@npa.ui.icon.picker.dialog.title'));
		$('#'+dlgId+'_selLabel').html(this.getLocalizedString('@npa.ui.icon.picker.dialog.selected'));
		$('#'+dlgId+'_cancel').html(this.getLocalizedString('@npa.ui.icon.picker.button.cancel'));
		$('#'+dlgId+'_ok').html(this.getLocalizedString('@npa.ui.icon.picker.button.ok'));
		$('#'+dlgId+'_up').attr('title',this.decode(this.getLocalizedString('@npa.ui.icon.picker.dialog.up')));
		$('#'+dlgId+'_filter').attr('placeholder',this.decode(this.getLocalizedString('@npa.ui.icon.picker.dialog.filter')));

		let picker = this;
		$('#'+dlgId+'_up').on('click',function(){
			if(picker.currentListing && picker.currentListing.parent!=null){
				picker.loadFolder(picker.currentListing.parent);
			}
		});
		$('#'+dlgId+'_filter').on('input',function(){
			picker.applyFilter();
		});
		$('#'+dlgId+'_ok').on('click',function(){
			picker.setValue(picker.selectedValue,true);
			$('#'+dlgId).modal('hide');
		});
		this.dialogReady = true;
	}

	open(){
		if(!this.dialogReady){
			this.buildDialog();
		}
		let dlgId = this.dialogId();
		this.selectedValue = this.value;
		this.updateSelection();
		$('#'+dlgId+'_filter').val('');
		$('#'+dlgId).modal('show');
		// start in the folder of the current icon when it belongs to an icon pack
		let startPath = '';
		if(this.value.startsWith(ICON_PICKER_IMG_URI)){
			let segments = this.value.substring(ICON_PICKER_IMG_URI.length).split('/');
			segments.pop();
			startPath = segments.map(decodeURIComponent).join('/');
		}
		this.loadFolder(startPath,true);
	}

	loadFolder(relativePath,fallbackToRoot=false){
		let picker = this;
		let dlgId = this.dialogId();
		let requestId = ++this.requestCounter;
		makeRESTCall('GET',ICON_PICKER_API_URI+'?path='+encodeURIComponent(relativePath),{},function(response){
			if(requestId!=picker.requestCounter){
				return; // a more recent navigation request superseded this one
			}
			if(response.status==200){
				picker.currentListing = response.data;
				picker.currentPath = response.data.path;
				$('#'+dlgId+'_filter').val('');
				picker.renderListing();
			}else if(fallbackToRoot && relativePath.length>0){
				picker.loadFolder('',false);
			}else{
				picker.showMessage('@npa.ui.icon.picker.dialog.error');
			}
		},function(){
			if(requestId==picker.requestCounter){
				picker.showMessage('@npa.ui.icon.picker.dialog.error');
			}
		});
	}

	showMessage(key){
		$('#'+this.dialogId()+'_grid').empty().append($('<div class="npa-icon-picker-empty"></div>').html(this.getLocalizedString(key)));
	}

	renderCrumbs(){
		let picker = this;
		let crumbs = $('#'+this.dialogId()+'_crumbs').empty();
		const addCrumb = function(label,path,isLast){
			let crumb = $('<span class="npa-icon-picker-crumb"></span>');
			if(isLast){
				crumb.addClass('active');
			}else{
				crumb.on('click',function(){ picker.loadFolder(path); });
			}
			if(label==null){
				crumb.html(picker.getLocalizedString('@npa.ui.icon.picker.dialog.root'));
			}else{
				crumb.text(label);
			}
			crumbs.append(crumb);
		};
		let segments = this.currentPath.length>0?this.currentPath.split('/'):[];
		addCrumb(null,'',segments.length==0);
		let cumulated = '';
		for(var i=0;i<segments.length;i++){
			cumulated += (i>0?'/':'')+segments[i];
			crumbs.append('<span class="npa-icon-picker-crumb-sep">/</span>');
			addCrumb(segments[i],cumulated,i==segments.length-1);
		}
		$('#'+this.dialogId()+'_up').prop('disabled',this.currentListing.parent==null);
	}

	renderListing(){
		let picker = this;
		let grid = $('#'+this.dialogId()+'_grid').empty();
		this.renderCrumbs();
		let listing = this.currentListing;
		listing.folders.forEach(function(folder){
			let item = $('<div class="npa-icon-picker-item npa-icon-picker-folder"></div>');
			item.attr('data-name',folder.name.toLowerCase());
			item.attr('title',folder.name);
			item.append($('<img width="32" height="32" alt="">').attr('src',ICON_PICKER_FOLDER_ICON));
			item.append($('<div class="npa-icon-picker-name"></div>').text(folder.name));
			item.on('click',function(){ picker.loadFolder(folder.path); });
			grid.append(item);
		});
		listing.icons.forEach(function(icon){
			let item = $('<div class="npa-icon-picker-item npa-icon-picker-icon"></div>');
			item.attr('data-name',icon.name.toLowerCase());
			item.attr('data-uri',icon.uri);
			item.attr('title',icon.name);
			item.append($('<img width="32" height="32" alt="" loading="lazy">').attr('src',icon.uri));
			item.append($('<div class="npa-icon-picker-name"></div>').text(icon.name));
			item.on('click',function(){
				picker.selectedValue = icon.uri;
				picker.updateSelection();
			});
			item.on('dblclick',function(){
				picker.selectedValue = icon.uri;
				picker.setValue(icon.uri,true);
				$('#'+picker.dialogId()).modal('hide');
			});
			grid.append(item);
		});
		this.updateSelection();
		this.applyFilter();
	}

	applyFilter(){
		let dlgId = this.dialogId();
		let filter = ($('#'+dlgId+'_filter').val() || '').toLowerCase();
		let visible = 0;
		$('#'+dlgId+'_grid .npa-icon-picker-item').each(function(){
			let match = filter.length==0 || String($(this).attr('data-name')).indexOf(filter)>=0;
			$(this).toggle(match);
			if(match){
				visible++;
			}
		});
		$('#'+dlgId+'_grid .npa-icon-picker-empty').remove();
		if(visible==0){
			$('#'+dlgId+'_grid').append($('<div class="npa-icon-picker-empty"></div>').html(this.getLocalizedString('@npa.ui.icon.picker.dialog.empty')));
		}
	}

	updateSelection(){
		let dlgId = this.dialogId();
		let selected = this.selectedValue;
		$('#'+dlgId+'_grid .npa-icon-picker-icon').each(function(){
			$(this).toggleClass('selected',$(this).attr('data-uri')==selected);
		});
		if(selected.length>0){
			$('#'+dlgId+'_selPreview').attr('src',selected).css('visibility','visible');
			$('#'+dlgId+'_selPath').text(selected);
		}else{
			$('#'+dlgId+'_selPreview').removeAttr('src').css('visibility','hidden');
			$('#'+dlgId+'_selPath').html(this.getLocalizedString('@npa.ui.icon.picker.dialog.none'));
		}
	}
}
