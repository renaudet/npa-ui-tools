/*
 * iconFormFieldEditor.js - NPA UI Tools Icon Form Field Editor (PluggableEditor for Form component)
 * Copyright 2026 Nicolas Renaudet - All rights reserved
 */

if(typeof npaIconPicker=='undefined'){
	npaIconPicker = {};
}

/*
 * Configuration in Form component fields:
 * {
 *   "name": "icon",
 *   "label": "Icon",
 *   "type": "icon",
 *   "placeholder": "@npa.ui.icon.picker.placeholder",
 *   "previewSize": 16,
 *   "help": "Choose an icon"
 * }
 */
npaIconPicker.IconFormFieldEditor = class IconFormFieldEditor extends PluggableEditor {
	picker = null;
	enabled = false;

	initialize(){
	}

	inputFieldId(){
		return this.field.form.getId()+'_'+this.field.config.name;
	}

	render(then){
		let baseId = this.inputFieldId();
		let pickerDivId = baseId+'_picker';
		let html = '';
		html += '<div id="'+pickerDivId+'"></div>';
		if(this.field.config.help){
			let helpId = baseId+'_help';
			html += '<div class="collapse" id="'+helpId+'">';
			html += '  <div class="card card-body form-help">'+this.field.getLocalizedString(this.field.config.help)+'</div>';
			html += '</div>';
		}
		this.getSite().append(html);

		let initialValue = '';
		if(typeof this.field.pendingValue!='undefined' && this.field.pendingValue!=null){
			initialValue = this.field.pendingValue;
		}else if(typeof this.field.config.value!='undefined' && this.field.config.value!=null){
			initialValue = this.field.config.value;
		}

		let pickerConfig = {
			"id": baseId+'_comp',
			"type": "npaIconPicker.IconPicker",
			"version": "1.0.0",
			"configuration": {
				"placeholder": this.field.config.placeholder || '@npa.ui.icon.picker.placeholder',
				"previewSize": this.field.config.previewSize || 16,
				"value": initialValue
			}
		};

		this.picker = new npaIconPicker.IconPicker(pickerDivId,pickerConfig);
		let editor = this;
		this.picker.render(function(){
			if(typeof editor.field.pendingValue!='undefined'){
				editor.setValue(editor.field.pendingValue);
				delete editor.field.pendingValue;
			}
			editor.picker.setEnabled(editor.enabled);
			then();
		});
	}

	getValue(){
		if(this.picker){
			return this.picker.getValue();
		}
		return (typeof this.field.pendingValue!='undefined' && this.field.pendingValue!=null)?this.field.pendingValue:'';
	}

	setValue(value){
		let val = (typeof value=='string')?value:'';
		if(this.picker){
			this.picker.setValue(val,false);
		}else{
			this.field.pendingValue = val;
		}
	}

	setEnabled(enabledValue){
		this.enabled = (enabledValue===true);
		if(this.picker){
			this.picker.setEnabled(this.enabled);
		}
	}

	setFocus(){
		if(this.picker){
			let id = this.picker.getId();
			$('#'+id+'_browse').trigger('focus');
		}
	}
}
