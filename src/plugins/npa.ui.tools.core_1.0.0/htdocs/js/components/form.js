/*
 * form.js - NPA UI Tools Core component framework's Form component'
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
class FormField {
	config = null;
	form = null;
	baseId = '';
	constructor(config,form){
		this.config = config;
		this.form = form;
	}
	render(parent){
		this.baseId = parent.prop('id');
	}
	setFocus(){
	}
	setEditMode(mode){
	}
	setData(parentObj){
	}
	assignData(parentObj){
	}
	vetoRaised(){
		return false;
	}
	getLocalizedString(reference,data=[]){
		return this.form.getLocalizedString(reference,data);
	}
}

class LabeledFormField extends FormField{
	constructor(config,form){
		super(config,form);
	}
	generateLabel(){
		var html = '';
		html += '<div class="col-2 form-row-label">';
		if(typeof this.config.label!='undefined' && this.config.label.length>0){
			html += this.getLocalizedString(this.config.label);
			if(this.config.isIdField){
				html += '&nbsp;<span style="color: red;">*</span>';
			}
			html += ':';
		}
		if(this.config.help){
			html += '<button class="btn btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#'+this.baseId+'_'+this.config.name+'_help"><img src="/uiTools/img/silk/information.png" title="help" style="padding-bottom: 5px;"></button>';
		}
		html += '</div>';
		return html;
	}
}

class TextField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let placeholder = '';
		if(typeof this.config.placeholder!='undefined'){
			placeholder = this.config.placeholder;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+this.config.size+'">';
		html += '    <input type="text" id="'+this.baseId+'_'+this.config.name+'" class="form-control-plaintext" placeholder="'+this.getLocalizedString(placeholder)+'" readonly>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(this.config.size<10){
			html += '  <div class="col-'+(10-this.config.size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).addClass('form-control');
			$('#'+inputFieldId).removeClass('form-control-plaintext');
			$('#'+inputFieldId).removeAttr('readonly');
		}else{
			$('#'+inputFieldId).removeClass('form-control');
			$('#'+inputFieldId).addClass('form-control-plaintext');
			$('#'+inputFieldId).attr('readonly');
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).val(parentObj[this.config.name]);
		$('#'+inputFieldId).removeClass('is-invalid');
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = $('#'+inputFieldId).val();
	}
	vetoRaised(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		var fieldValue = $('#'+inputFieldId).val();
		if(this.config.required && (typeof fieldValue=='undefined' || fieldValue.length==0)){
			$('#'+inputFieldId).addClass('is-invalid');
			$('#'+inputFieldId).focus();
			showError(this.getLocalizedString('@form.textField.error',[this.config.name]));
			return true;
		}else{
			$('#'+inputFieldId).removeClass('is-invalid');
			return false;
		}
	}
}

class PasswordField extends TextField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let placeholder = '';
		if(typeof this.config.placeholder!='undefined'){
			placeholder = this.config.placeholder;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+this.config.size+'">';
		html += '    <input type="password" id="'+this.baseId+'_'+this.config.name+'" class="form-control-plaintext" placeholder="'+placeholder+'" readonly>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(this.config.size<10){
			html += '  <div class="col-'+(10-this.config.size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setData(parentObj){
		if('password'==this.config.type){
			super.setData(parentObj);
		}
		if('passwordCheck'==this.config.type){
			var inputFieldId = this.baseId+'_'+this.config.name;
			var checkedValue = parentObj[this.config.checkField];
			if(typeof checkedValue!='undefined'){
				$('#'+inputFieldId).val(checkedValue);
			}else{
				$('#'+inputFieldId).val('');
			}
			$('#'+inputFieldId).removeClass('is-invalid');
		}
	}
	assignData(parentObj){
		if('password'==this.config.type){
			var inputFieldId = this.baseId+'_'+this.config.name;
			parentObj[this.config.name] = $('#'+inputFieldId).val();
		}
	}
	vetoRaised(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if('password'==this.config.type){
			var fieldValue = $('#'+inputFieldId).val();
			if(this.config.required && (typeof fieldValue=='undefined' || fieldValue.length==0)){
				$('#'+inputFieldId).addClass('is-invalid');
				$('#'+inputFieldId).focus();
				showError(this.getLocalizedString('@form.textField.error',[this.config.name]));
				return true;
			}else{
				if(this.config.minimumLength && fieldValue.length<this.config.minimumLength){
					$('#'+inputFieldId).addClass('is-invalid');
					$('#'+inputFieldId).focus();
					showError(this.getLocalizedString('@form.passwordField.error.length',[this.config.name,this.config.minimumLength]));
					return true;
				}else{
					$('#'+inputFieldId).removeClass('is-invalid');
					return false;
				}
			}
		}
		if('passwordCheck'==this.config.type){
			var fieldValue = $('#'+inputFieldId).val();
			var checkedFieldValue = $('#'+this.baseId+'_'+this.config.checkField).val();
			if(fieldValue!=checkedFieldValue ){
				$('#'+inputFieldId).addClass('is-invalid');
				$('#'+inputFieldId).focus();
				$('#'+this.baseId+'_'+this.config.checkField).addClass('is-invalid');
				showError(this.getLocalizedString('@form.passwordField.error.match'));
				return true;
			}else{
				$('#'+inputFieldId).removeClass('is-invalid');
				$('#'+this.baseId+'_'+this.config.checkField).removeClass('is-invalid');
				return false;
			}
		}
		return true;
	}
}

class NumericField extends TextField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let placeholder = '';
		if(typeof this.config.placeholder!='undefined'){
			placeholder = this.config.placeholder;
		}
		let size = 3;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'">';
		html += '    <input type="number" id="'+this.baseId+'_'+this.config.name+'" class="form-control-plaintext" placeholder="'+placeholder+'" value="'+this.config.default+'" readonly>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(Number.isInteger(parentObj[this.config.name])){
			$('#'+inputFieldId).val(parentObj[this.config.name]);
			$('#'+inputFieldId).removeClass('is-invalid');
		}else{
			$('#'+inputFieldId).val(this.config.default);
			$('#'+inputFieldId).addClass('is-invalid');
		}
	}
	assignData(parentObj){
		const parsed = parseInt($('#'+this.baseId+'_'+this.config.name).val(), 10);
		if (isNaN(parsed)){
			parentObj[this.config.name] = field.default;
		}else{
			parentObj[this.config.name] = parsed;
		}
	}
	vetoRaised(){
		console.log('NumericField#vetoRaised()');
		console.log(this.config);
		var inputFieldId = this.baseId+'_'+this.config.name;
		var fieldValue = $('#'+inputFieldId).val();
		const parsed = parseInt(fieldValue, 10);
		if(this.config.required && isNaN(parsed)){
			$('#'+inputFieldId).addClass('is-invalid');
			$('#'+inputFieldId).focus();
			showError(this.getLocalizedString('@form.numericField.error',[this.config.name]));
			return true;
		}else{
			$('#'+inputFieldId).removeClass('is-invalid');
			return false;
		}
	}
}

const DATE_PICKER_DEPTS = [
	{"type": "css","uri": "/css/bootstrap-datepicker.standalone.css"},
	{"type": "js","uri": "/js/bootstrap-datepicker.js"},
	{"type": "js","uri": "/js/moment.min.js"}
]

class DateField extends TextField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var size = typeof this.config.size!='undefined'?this.config.size:3;
		var html = '';
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'">';
		html += '    <input type="text" id="'+this.baseId+'_'+this.config.name+'" class="form-control-plaintext" style="'+this.config.style+'" placeholder="YYYY/MM/DD" data-provide="datepicker" data-date-format="yyyy/mm/dd" readonly>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
		var target = this;
		loadDeps(DATE_PICKER_DEPTS,function(){
			  $('#'+target.baseId+'_'+target.config.name).val(moment().format('YYYY/MM/DD'));
		});
	}
	vetoRaised(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		var fieldValue = $('#'+inputFieldId).val();
		if(this.config.required && (typeof fieldValue=='undefined' || fieldValue.length<10 || fieldValue.indexOf('/')<0)){
			$('#'+inputFieldId).addClass('is-invalid');
			$('#'+inputFieldId).focus();
			showError(this.getLocalizedString('@form.dateField.error',[this.config.name]));
			return true;
		}else{
			$('#'+inputFieldId).removeClass('is-invalid');
			return false;
		}
	}
}

class CheckField extends FormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		var divClass = ' form-check';
		var role = '';
		var checkClass = ' form-checkbox';
		if(this.config.type=='switch'){
			divClass += ' form-switch';
			role = ' role="switch"';
			checkClass = '';
		}
		html += '<div class="row form-row">';
		html += '  <div class="col-2">&nbsp;</div>';
		html += '  <div class="col-9'+divClass+'">';
		html += '    <input type="checkbox" id="'+this.baseId+'_'+this.config.name+'"'+role+' disabled class="form-check-input'+checkClass+'" style="margin-left: -10px;margin-right: 8px;" value="true"'+(this.config.default?' checked>':'>');
		html += '    <label class="form-check-label" for="'+this.baseId+'_'+this.config.name+'">';
		html += this.getLocalizedString(this.config.label);
		if(this.config.help){
			html += '<button class="btn btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#'+this.baseId+'_'+this.config.name+'_help"><img src="/uiTools/img/silk/information.png" title="help" style="padding-bottom: 5px;"></button>';
		}
		html += '    </label>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		html += '  <div class="col-1">&nbsp;</div>';
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).prop('disabled',false);
		}else{
			$('#'+inputFieldId).prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(typeof parentObj[this.config.name]!='undefined' && parentObj[this.config.name]){
			$('#'+inputFieldId).prop('checked',true);
		}else{
			if(typeof this.config.default!='undefined'){
				$('#'+inputFieldId).prop('checked',this.config.default);
			}else{
				$('#'+inputFieldId).prop('checked',false);
			}
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		var checked = $('#'+inputFieldId).prop('checked');
		parentObj[this.config.name] = checked;
	}
	vetoRaised(){
		return false;
	}
}

class RadioField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-9 form-check">';
		for(var i=0;i<this.config.choices.length;i++){
			var choice = this.config.choices[i];
			html += '<div>';
			html += '<input class="form-check-input" type="radio" style="margin-left: -10px;margin-right: 7px;" name="'+this.baseId+'_'+this.config.name+'" id="'+this.baseId+'_'+this.config.name+'_'+i+'"';
			if(choice.value==this.config.default){
				html += ' checked';
			}
			html += ' value="'+choice.value+'"';
			html += ' disabled>';
			html += '<label class="form-check-label" for="'+this.baseId+'_'+this.config.name+'_'+i+'">';
			html += this.getLocalizedString(choice.label);
			html += '</label>';
			html += '</div>';
		}
		html += '  </div>';
		html += '  <div class="col-1">&nbsp;</div>';
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('input[name='+inputFieldId+']').prop('disabled',false);
		}else{
			$('input[name='+inputFieldId+']').prop('disabled',true);
		}
	}
	setFocus(){
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(typeof parentObj[this.config.name]!='undefined' && parentObj[this.config.name]){
			$('input[name='+inputFieldId+'][value=\''+parentObj[this.config.name]+'\']').prop('checked',true);
		}else{
			$('input[name='+inputFieldId+'][value=\''+this.config.default+'\']').prop('checked',true);
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = $('input[name='+inputFieldId+']:checked').val();
	}
	vetoRaised(){
		return false;
	}
}

class ColorPickerField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-10">';
		html += '    <input type="color" name="'+this.baseId+'_'+this.config.name+'" id="'+this.baseId+'_'+this.config.name+'" class="form-control form-control-color" value="'+this.config.default+'" title="Click to choose a color" disabled>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('input[name='+inputFieldId+']').prop('disabled',false);
		}else{
			$('input[name='+inputFieldId+']').prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('input[name='+inputFieldId+']').focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(typeof parentObj[this.config.name]!='undefined' && parentObj[this.config.name]){
			$('input[name='+inputFieldId+']').val(parentObj[this.config.name]);
		}else{
			$('input[name='+inputFieldId+']').val(this.config.default);
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = $('input[name='+inputFieldId+']').val();
	}
	vetoRaised(){
		return false;
	}
}

class RangeSelectorField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let size = 10;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'">';
		html += '    <input type="range" id="'+this.baseId+'_'+this.config.name+'" name="'+this.baseId+'_'+this.config.name+'" class="form-range form-slider" value="'+this.config.default+'" min="'+this.config.min+'" max="'+this.config.max+'" step="'+this.config.step+'" disabled>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.getLocalizedString(this.config.help)+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'"><span id="'+this.baseId+'_'+this.config.name+'_value" class="form-text">'+this.config.default+'</span></div>';
		}
		html += '</div>';
		parent.append(html);
		var source = this;
		$('input[name='+this.baseId+'_'+this.config.name+']').on('input',function(){
			$('#'+source.baseId+'_'+source.config.name+'_value').html($(this).val());
		});
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('input[name='+inputFieldId+']').prop('disabled',false);
		}else{
			$('input[name='+inputFieldId+']').prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('input[name='+inputFieldId+']').focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(Number.isInteger(parentObj[this.config.name])){
			$('input[name='+inputFieldId+']').val(parentObj[this.config.name]);
		}else{
			$('input[name='+inputFieldId+']').val(this.config.default);
		}
		$('#'+inputFieldId+'_value').html($('input[name='+inputFieldId+']').val());
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = parseInt($('input[name='+inputFieldId+']').val());
	}
	vetoRaised(){
		return false;
	}
}

class SelectField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let size = 8;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'">';
		html += '    <select id="'+this.baseId+'_'+this.config.name+'" class="form-select" disabled>';
		if(!this.config.required){
			html += '<option value="">'+this.getLocalizedString('@form.selectField.select.value')+'</option>';
		}
		for(var i=0;i<this.config.values.length;i++){
			var value = this.config.values[i];
			if(typeof value.label!='undefined'){
				html += '<option value="';
				html += value.value;
				html += '">';
				html += this.getLocalizedString(value.label);
				html += '</option>';
			}else{
				html += '<option value="';
				html += value;
				html += '">';
				html += value;
				html += '</option>';
			}
		}
		html += '    </select>';
		if(this.config.help){
			html += '<div class="collapse" id="'+this.baseId+'_'+this.config.name+'_help">';
			html += '  <div class="card card-body form-help">'+this.config.help+'</div>';
			html += '</div>';
		}
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).prop('disabled',false);
		}else{
			$('#'+inputFieldId).prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(typeof parentObj[this.config.name]!='undefined'){
			$('#'+inputFieldId).val(parentObj[this.config.name]);
		}else{
			$('#'+inputFieldId+'  :nth-child(0)').prop('selected', true);
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = $('#'+inputFieldId).val();
	}
	vetoRaised(){
		return false;
	}
}

const CODE_MIRROR_DEPTS = [
	{"type": "css","uri": "/css/codemirror.css"},
	{"type": "css","uri": "/css/codeMirror/abcdef.css"},
	{"type": "css","uri": "/css/codeMirror/ambiance.css"},
	{"type": "js","uri": "/js/codemirror.js"},
	{"type": "js","uri": "/js/codeMirror/autorefresh.js"},
	{"type": "js","uri": "/js/codeMirror/javascript.js"},
	{"type": "js","uri": "/js/codeMirror/loadmode.js"},
	{"type": "js","uri": "/js/codeMirror/meta.js"}
];
const DEFAULT_EDITOR_HEIGHT = 300;

class SourceEditorField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-10">';
		if(typeof this.config.buttons!='undefined'){
			html += '<div id="'+this.baseId+'_'+this.config.name+'_buttonBar" class="d-grid gap-2 d-md-flex">';//justify-content-md-end
			for(var i=0;i<this.config.buttons.length;i++){
				var button = this.config.buttons[i];
				html += '<button type="button" class="btn btn-sm btn-icon" data-actionid="'+button.actionId+'" disabled><img class="img-icon" src="'+button.icon+'" title="'+this.getLocalizedString(button.label)+'"></button>';
			}
			html += '</div>';
		}
		html += '    <textarea id="'+this.baseId+'_'+this.config.name+'" class="form-control" style="border: 1px solid lightgrey; background-color: #fff;"></textarea>';
		html += '  </div>';
		html += '</div>';
		parent.append(html);
		var source = this;
		$('#'+this.baseId+'_'+this.config.name+'_buttonBar button').on('click',function(){
			var actionId = $(this).data('actionid');
			source.form.runtime.fireAction(actionId,source.form.editors[source.config.name]);
		});
		loadDeps(CODE_MIRROR_DEPTS,function(){
			var textArea = document.getElementById(source.baseId+'_'+source.config.name);
			source.form.editors[source.config.name] = CodeMirror.fromTextArea(textArea, {
			    lineNumbers: true,
    			autoRefresh:true,
			    theme: 'abcdef',
			    mode:  "javascript",
			    readOnly: true
			});
			if(typeof source.config.height!='undefined'){
				source.form.editors[source.config.name].setSize(null,source.config.height);
			}else{
				source.form.editors[source.config.name].setSize(null,DEFAULT_EDITOR_HEIGHT);
			}
		});
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			this.form.editors[this.config.name].setOption('readOnly',false);
			if(typeof this.config.buttons!='undefined'){
				$('#'+inputFieldId+'_buttonBar button').prop('disabled',false);
			}
		}else{
			this.form.editors[this.config.name].setOption('readOnly',true);
			if(typeof this.config.buttons!='undefined'){
				$('#'+inputFieldId+'_buttonBar button').prop('disabled',true);
			}
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(typeof parentObj[this.config.name]!='undefined'){
			this.form.editors[this.config.name].setValue(parentObj[this.config.name]);
		}else{
			if(this.config.type=='json'){
				this.form.editors[this.config.name].setValue('{\n}');
			}
			if(this.config.type=='javascript'){
				this.form.editors[this.config.name].setValue('//some javascript code snippet here\n');
			}
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = this.form.editors[this.config.name].getValue();
	}
	vetoRaised(){
		if(this.config.type=='json'){
			var jsonTxt = this.form.editors[this.config.name].getValue();
			try{
				var jsonObj = JSON.parse(jsonTxt);
				return false;
			}catch(parseException){
				showError(this.getLocalizedString('@form.editor.json.error',[this.config.name]));
				return true;
			}
		}else{
			return false;
		}
	}
}

class TextAreaField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let size = 8;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'">';
		html += '    <textarea id="'+this.baseId+'_'+this.config.name+'" class="form-control" style="'+this.config.style+'" row="'+this.config.rows+'" disabled="true"></textarea>';
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).prop('disabled',false);
		}else{
			$('#'+inputFieldId).prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).val(parentObj[this.config.name]);
		$('#'+inputFieldId).removeClass('is-invalid');
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		parentObj[this.config.name] = $('#'+inputFieldId).val();
	}
	vetoRaised(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		var fieldValue = $('#'+inputFieldId).val();
		if(this.config.required && (typeof fieldValue=='undefined' || fieldValue.length==0)){
			$('#'+inputFieldId).addClass('is-invalid');
			$('#'+inputFieldId).focus();
			showError(this.getLocalizedString('@form.textField.error',[this.config.name]));
			return true;
		}else{
			$('#'+inputFieldId).removeClass('is-invalid');
			return false;
		}
	}
}

class ArrayEditorField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let rows = 7;
		if(typeof this.config.rows!='undefined'){
			rows = this.config.rows;
		}
		let datatype = 'Text';
		if(typeof this.config.datatype!='undefined'){
			datatype = this.config.datatype;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-9">';
		html += '    <div class="row form-row">';
		if(typeof this.config.editable=='undefined' || this.config.editable){
			html += '      <div class="col-9">';
			html += '        <input id="'+this.baseId+'_'+this.config.name+'_edit" type="text" class="form-control" readonly>';
			html += '      </div>';
			html += '      <div class="col-1">';
			html += '        <button id="'+this.baseId+'_'+this.config.name+'_gobtn" type="button" class="btn btn-primary" disabled>'+this.getLocalizedString('@form.arrayEditor.button.go')+'</button>';
			html += '      </div>';
			html += '    </div>';
		}
		html += '    <div class="row">';
		html += '      <div class="col-9">';
		html += '        <select id="'+this.baseId+'_'+this.config.name+'_list" class="form-select" size="'+rows+'" disabled>';
		html += '        </select>';
		html += '      </div>';
		if(typeof this.config.editable=='undefined' || this.config.editable){
			html += '      <div class="col-1">';
			html += '        <button type="button" id="'+this.baseId+'_'+this.config.name+'_addbtn" class="btn btn-sm scafFormBtn" disabled><img src="/uiTools/img/silk/add.png" class="scafFormIcon" title="'+this.getLocalizedString('@form.arrayEditor.button.add',[datatype])+'"></button>';
			html += '        <button type="button" id="'+this.baseId+'_'+this.config.name+'_editbtn" class="btn btn-sm scafFormBtn" disabled><img src="/uiTools/img/silk/pencil.png" class="scafFormIcon" title="'+this.getLocalizedString('@form.arrayEditor.button.edit',[datatype])+'"></button>';
			html += '        <button type="button" id="'+this.baseId+'_'+this.config.name+'_delbtn" class="btn btn-sm scafFormBtn" disabled><img src="/uiTools/img/silk/cross.png" class="scafFormIcon" title="'+this.getLocalizedString('@form.arrayEditor.button.delete',[datatype])+'"></button>';
			html += '        <button type="button" id="'+this.baseId+'_'+this.config.name+'_upbtn" class="btn btn-sm scafFormBtn" disabled><img src="/uiTools/img/silk/arrow_up.png" class="scafFormIcon" title="'+this.getLocalizedString('@form.arrayEditor.button.up',[datatype])+'"></button>';
			html += '        <button type="button" id="'+this.baseId+'_'+this.config.name+'_downbtn" class="btn btn-sm scafFormBtn" disabled><img src="/uiTools/img/silk/arrow_down.png" class="scafFormIcon" title="'+this.getLocalizedString('@form.arrayEditor.button.down',[datatype])+'"></button>';
			html += '      </div>';
		}else{
			html += '      <div class="col-1">&nbsp;</div>';
		}
		html += '    </div>';
		html += '  </div>';
		html += '  <div class="col-1">&nbsp;</div>';
		html += '</div>';
		parent.append(html);
		var baseId = this.baseId+'_'+this.config.name;
		$('#'+baseId+'_addbtn').on('click',function(){
			$('#'+baseId+'_edit').removeAttr('readonly');
			$('#'+baseId+'_gobtn').prop('disabled',false);
			$('#'+baseId+'_edit').focus();
			$('#'+baseId+'_list option:selected').prop('selected', false);
		});
		$('#'+baseId+'_gobtn').on('click',function(){
			var value = $('#'+baseId+'_edit').val();
			var selectedValue = $('#'+baseId+'_list option:selected').val();
			if(selectedValue){
				//update
				$('#'+baseId+'_list option:selected').val(value);
				$('#'+baseId+'_list option:selected').text(value);
			}else{
				//create
				var option = '<option value="'+value+'">'+value+'</option>';
				$('#'+baseId+'_list').append(option);
			}
			$('#'+baseId+'_editbtn').prop('disabled',false);
			$('#'+baseId+'_delbtn').prop('disabled',false);
			$('#'+baseId+'_upbtn').prop('disabled',false);
			$('#'+baseId+'_downbtn').prop('disabled',false);
			$('#'+baseId+'_list option[value=\''+value+'\']').prop('selected', true);
			$('#'+baseId+'_edit').val('');
			$('#'+baseId+'_edit').attr('readonly');
			$('#'+baseId+'_gobtn').prop('disabled',true);
		});
		$('#'+baseId+'_delbtn').on('click',function(){
			var selectedValue = $('#'+baseId+'_list option:selected').val();
			var selectedOption =   $('#'+baseId+'_list option[value=\''+selectedValue+'\']');
			selectedOption.remove();
			$('#'+baseId+'_edit').val('');
			$('#'+baseId+'_edit').attr('readonly');
			$('#'+baseId+'_gobtn').prop('disabled',true);
			$('#'+baseId+'_editbtn').prop('disabled',true);
			$('#'+baseId+'_delbtn').prop('disabled',true);
			$('#'+baseId+'_upbtn').prop('disabled',true);
			$('#'+baseId+'_downbtn').prop('disabled',true);
		});
		$('#'+baseId+'_editbtn').on('click',function(){
			var selectedValue = $('#'+baseId+'_list option:selected').val();
			$('#'+baseId+'_edit').val(selectedValue);
			$('#'+baseId+'_edit').removeAttr('readonly');
			$('#'+baseId+'_gobtn').prop('disabled',false);
			$('#'+baseId+'_editbtn').prop('disabled',true);
			$('#'+baseId+'_delbtn').prop('disabled',false);
			$('#'+baseId+'_upbtn').prop('disabled',false);
			$('#'+baseId+'_downbtn').prop('disabled',false);
			$('#'+baseId+'_edit').focus();
		});
		$('#'+baseId+'_list').on('change',function(){
			$('#'+baseId+'_editbtn').prop('disabled',false);
			$('#'+baseId+'_delbtn').prop('disabled',false);
			$('#'+baseId+'_upbtn').prop('disabled',false);
			$('#'+baseId+'_downbtn').prop('disabled',false);
		});
		$('#'+baseId+'_upbtn').on('click',function(){
			var selectedIndex = $('#'+baseId+'_list').prop('selectedIndex');
			if(selectedIndex>0){//:nth-child(0)
				var current = $('#'+baseId+'_list :nth-child('+(selectedIndex+1)+')');
				var prev = $('#'+baseId+'_list :nth-child('+(selectedIndex)+')');
				var tmp = current.val();
				current.val(prev.val());
				current.text(prev.text());
				prev.val(tmp);
				prev.text(tmp);
				prev.prop('selected', true);
			}
		});
		$('#'+baseId+'_downbtn').on('click',function(){
			var selectedIndex = $('#'+baseId+'_list').prop('selectedIndex');
			var maxIndex = $('#'+baseId+'_list option').length-1;
			if(selectedIndex<maxIndex){
				var current = $('#'+baseId+'_list :nth-child('+(selectedIndex+1)+')');
				var next = $('#'+baseId+'_list :nth-child('+(selectedIndex+2)+')');
				var tmp = current.val();
				current.val(next.val());
				current.text(next.text());
				next.val(tmp);
				next.text(tmp);
				next.prop('selected', true);
			}
		});
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId+'_list').prop('disabled',false);
			$('#'+inputFieldId+'_addbtn').prop('disabled',false);
		}else{
			$('#'+inputFieldId+'_edit').attr('readonly');
			$('#'+inputFieldId+'_gobtn').prop('disabled',true);
			$('#'+inputFieldId+'_list').prop('disabled',true);
			$('#'+inputFieldId+'_addbtn').prop('disabled',true);
			$('#'+inputFieldId+'_editbtn').prop('disabled',true);
			$('#'+inputFieldId+'_delbtn').prop('disabled',true);
		}
	}
	setFocus(){
		let inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	setData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(Array. isArray(parentObj[this.config.name])){
			$('#'+inputFieldId+'_list').empty();
			for(var j=0;j<parentObj[this.config.name].length;j++){
				var value = parentObj[this.config.name][j];
				var option = '<option value="'+value+'">'+value+'</option>'
				$('#'+inputFieldId+'_list').append(option);
			}
		}else{
			$('#'+inputFieldId+'_list').empty();
		}
	}
	assignData(parentObj){
		var inputFieldId = this.baseId+'_'+this.config.name;
		var values = [];
		$('#'+inputFieldId+'_list option').each(function(){
		    var value = $(this).val();
		    values.push(value);
		});
		parentObj[this.config.name] = values;
	}
	vetoRaised(){
		return false;
	}
}

class DatatypeField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		let size = 10;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'" id="'+this.config.siteId+'">';
		html += '  </div>';
		if(size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	setEditMode(editing){
		var innerForm = npaUi.getComponent(this.config.formRef);
		if(innerForm){
			innerForm.setEditMode(editing);
		}else{
			showError('Unresolved reference to Form component '+this.config.formRef);
		}
	}
	setFocus(){
	}
	setData(parentObj){
		var innerForm = npaUi.getComponent(this.config.formRef);
		if(typeof parentObj[this.config.name]!='undefined'){
			innerForm.setSelection(parentObj[this.config.name]);
		}else{
			innerForm.setSelection({});
		}
	}
	assignData(parentObj){
		var innerForm = npaUi.getComponent(this.config.formRef);
		parentObj[this.config.name] = innerForm.getData();
	}
	vetoRaised(){
		var innerForm = npaUi.getComponent(this.config.formRef);
		return !innerForm.checkFormData();
	}
}

class UploadField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let html = '';
		let buttonLabel = 'Upload';
		if(typeof this.config.uploadButtonLabel!='undefined'){
			buttonLabel = this.config.uploadButtonLabel;
		}
		var action = 'upload';
		if(typeof this.config.actionId!='undefined'){
			action = this.config.actionId;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-7">';
		html += '     <input class="form-control" type="file" id="'+this.baseId+'_'+this.config.name+'" disabled/>';
		html += '  </div>';
		html += '  <div class="col-3">';
		html += '    <button id="'+this.baseId+'_'+this.config.name+'_submit" type="button" class="btn btn-primary" disabled>'+this.getLocalizedString(buttonLabel)+'</button>';
		html += '  </div>';
		html += '</div>';
		parent.append(html);
		var source = this;
		$('#'+this.baseId+'_'+this.config.name+'_submit').on('click',function(){
			npaUi.fireEvent(action,{"action": action,"field": $('#'+source.baseId+'_'+source.config.name)});
		});
	}
	setEditMode(editing){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).prop('disabled',false);
			$('#'+inputFieldId+'_submit').prop('disabled',false);
		}else{
			$('#'+inputFieldId).prop('disabled',true);
			$('#'+inputFieldId+'_submit').prop('disabled',true);
		}
	}
	setFocus(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	vetoRaised(){
		return false;
	}
}

class ButtonField extends FormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		var html = '';
		html += '<div class="row form-row">';
		html += '  <div class="col-2">&nbsp;</div>';
		html += '  <div class="col-10">';
		html += '     <button type="button" id="'+this.baseId+'_'+this.config.name+'" class="btn btn-'+this.config.buttonType+'" disabled>'+this.getLocalizedString(this.config.label)+'</button>';
		html += '  </div>';
		html += '</div>';
		parent.append(html);
		var source = this;
		$('#'+this.baseId+'_'+this.config.name).on('click',function(){
			npaUi.fireEvent(source.config.actionId,{"action": source.config.actionId,"field": $('#'+source.baseId+'_'+source.config.name)});
		});
	}
	setEditMode(editing){
		var inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			$('#'+inputFieldId).prop('disabled',false);
		}else{
			$('#'+inputFieldId).prop('disabled',true);
		}
	}
	setFocus(){
		var inputFieldId = this.baseId+'_'+this.config.name;
		$('#'+inputFieldId).focus();
	}
	vetoRaised(){
		return false;
	}
}

class PlaceholderField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		let html = '';
		let size = 10;
		if(typeof this.config.size!='undefined'){
			size = this.config.size;
		}
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-'+size+'" id="'+this.config.siteId+'">';
		html += '  </div>';
		if(this.config.size<10){
			html += '  <div class="col-'+(10-size)+'">&nbsp;</div>';
		}
		html += '</div>';
		parent.append(html);
	}
	vetoRaised(){
		return false;
	}
}

const RICH_TEXT_EDITOR_DEPTS = [
	 {"type": "css","uri": "/css/rte/rte.css"},
     {"type": "js","uri": "/js/richText/rte.js"},
     {"type": "js","uri": "/uiTools/js/richText/rteControls.js"}
];

class RichTextEditorField extends LabeledFormField{
	constructor(config,form){
		super(config,form);
	}
	render(parent){
		this.baseId = parent.prop('id');
		let inputFieldId = this.baseId+'_'+this.config.name;
		var html = '';
		html += '<div class="row form-row">';
		html += this.generateLabel();
		html += '  <div class="col-10">';
		if(typeof this.config.buttons!='undefined'){
			html += '<div id="'+inputFieldId+'_buttonBar" class="d-grid gap-2 d-md-flex">';//justify-content-md-end
			for(var i=0;i<this.config.buttons.length;i++){
				var button = this.config.buttons[i];
				html += '<button type="button" class="btn btn-sm btn-icon" data-actionid="'+button.actionId+'" disabled><img class="img-icon" src="'+button.icon+'" title="'+this.getLocalizedString(button.label)+'"></button>';
			}
			html += '</div>';
		}
		html += '    <div id="'+inputFieldId+'"></div>';
		html += '  </div>';
		html += '</div>';
		parent.append(html);
		var source = this;
		$('#'+inputFieldId+'_buttonBar button').on('click',function(){
			var actionId = $(this).data('actionid');
			npaUi.fireEvent(actionId,{"action": actionId,"editor": source.form.editors[source.config.name]});
		});
		loadDeps(RICH_TEXT_EDITOR_DEPTS,function(){
			var width = 800; // default width
			var height = 300; // default height
			if(typeof source.config.height!='undefined'){
				height = source.config.height;
			}
			if(typeof source.config.width!='undefined'){
				width = source.config.width;
			}
			var parentId = source.baseId+'_'+source.config.name;
			var editor = new RichTextEditor(parentId+'_rte',width,height);
			editor.controlObject = 'NpaEditorControls';
			editor.init($('#'+parentId).get(0));
			setTimeout(function(){ editor.disable(); },500);
			source.form.editors[source.config.name] = editor;
		});
	}
	setEditMode(editing){
		let inputFieldId = this.baseId+'_'+this.config.name;
		if(editing){
			this.form.editors[this.config.name].enable();
			if(typeof this.config.buttons!='undefined'){
				$('#'+inputFieldId+'_buttonBar button').prop('disabled',false);
			}
		}else{
			this.form.editors[this.config.name].disable();
			if(typeof this.config.buttons!='undefined'){
				$('#'+inputFieldId+'_buttonBar button').prop('disabled',true);
			}
		}
	}
	setFocus(){
		this.form.editors[this.config.name].focus();
	}
	setData(parentObj){
		if(typeof parentObj[this.config.name]!='undefined'){
			this.form.editors[this.config.name].setText(parentObj[this.config.name]);
		}else{
			this.form.editors[this.config.name].setText('');
		}
	}
	assignData(parentObj){
		parentObj[this.config.name] = this.form.editors[this.config.name].getText();
	}
	vetoRaised(){
		return false;
	}
}
 
npaUiCore.Form = class Form extends NpaUiComponent{
	fieldCache = {};
	editors = {};
	formData = null;
	initialize(then){
		$.loadCss('/uiTools/css/form.css',then);
	}
	createFormField(config){
		if(typeof config.type=='undefined'){
			config.type = 'text';
		}
		if('text'==config.type){
			return new TextField(config,this)
		}
		if('password'==config.type || 'passwordCheck'==config.type){
			return new PasswordField(config,this)
		}
		if('integer'==config.type){
			return new NumericField(config,this)
		}
		if('date'==config.type){
			return new DateField(config,this)
		}
		if('option'==config.type || 'check'==config.type|| 'switch'==config.type){
			return new CheckField(config,this)
		}
		if('radio'==config.type){
			return new RadioField(config,this)
		}
		if('color'==config.type){
			return new ColorPickerField(config,this)
		}
		if('range'==config.type){
			return new RangeSelectorField(config,this)
		}
		if('select'==config.type){
			return new SelectField(config,this)
		}
		if('json'==config.type || 'javascript'==config.type){
			return new SourceEditorField(config,this)
		}
		if('textarea'==config.type){
			return new TextAreaField(config,this)
		}
		if('array'==config.type){
			return new ArrayEditorField(config,this)
		}
		if('datatype'==config.type){
			return new DatatypeField(config,this)
		}
		if('upload'==config.type){
			return new UploadField(config,this)
		}
		if('button'==config.type){
			return new ButtonField(config,this)
		}
		if('placeholder'==config.type){
			return new PlaceholderField(config,this)
		}
		if('richText'==config.type){
			return new RichTextEditorField(config,this);
		}
		return new FormField(config,this);
	}
	render(){
		let config = this.getConfiguration();
		let html = '';
		html += '<form id="'+this.getId()+'_form" class="'+config.class+'">';
		html += '</form>';
		this.parentDiv().html(html);
		for(var i=0;i<config.fields.length;i++){
			var fieldConfig = config.fields[i];
			this.fieldCache[fieldConfig.name] = this.createFormField(fieldConfig);
		}
		this.renderFields();
	}
	renderFields(){
		let config = this.getConfiguration();
		let html = '';
		let formClass = 'form-frame';
		if(typeof config.class!='undefined'){
			formClass = config.class;
		}
		html += '<div id="'+this.getId()+'" class="'+formClass+'">'
		if(typeof config.title!='undefined'){
			html += '<div class="form-title">'+this.getLocalizedString(config.title)+'</div>';
		}
		html += '</div>';
		$('#'+this.getId()+'_form').append(html);
		var parent = $('#'+this.getId());
		for(var i=0;i<config.fields.length;i++){
			var fieldId = config.fields[i].name;
			console.log('looking for helper class for field #'+fieldId+' ('+config.fields[i].type+')');
			var field = this.fieldCache[fieldId];
			if(typeof field!='undefined'){
				console.log('calling '+field.config.type+' rendering');
				field.render(parent);
			}else{
				console.log('helper class not found in cache');
			}
		}
	}
	setEditMode(mode){
		for(var fieldId in this.fieldCache){
			let field = this.fieldCache[fieldId];
			field.setEditMode(mode);
		}
	}
	
	setData(data){
		this.formData = data;
		if(this.formData==null){
			this.formData = {};
		}
		if(typeof this.formData!='undefined'){
			for(var fieldId in this.fieldCache){
				let field = this.fieldCache[fieldId];
				field.setData(this.formData);
			}
		}
	}
	getData(){
		var data = Object.assign({},this.formData);
		for(var fieldId in this.fieldCache){
			let field = this.fieldCache[fieldId];
			field.assignData(data);
		}
		return data;
	}
	isValid(){
		var errorFound = false;
		for(var fieldId in this.fieldCache){
			let field = this.fieldCache[fieldId];
			console.log('checking veto for field '+fieldId);
			if(field.vetoRaised()){
				errorFound = true;
			}
			console.log('veto: '+errorFound);
		}
		return !errorFound;
	}
	onItemSelected(item){
		this.setEditMode(false);
		if(typeof item!='undefined' && item!=null){
			this.setData(item);
		}else{
			this.setData({});
		}
	}
}