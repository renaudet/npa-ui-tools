/*
 * npaUiComponentModel.js - NPA UI Tools Core component object model
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
class PluggableEditor {
	field = null;
	constructor(field){
		this.field = field;
	}
	render(){
		let html = '<div style="height: 50px;background-color: #c3c3c3;border: 1px solid #000000;margin: 5px;padding: 10px;">'+this.constructor.name+'</div>';
		this.getSite().append(html);
	}
	getConfig(){
		return this.field.config;
	}
	getSite(){
		return $('#'+this.getConfig().siteId);
	}
	getValue(){
		return '';
	}
	setValue(value){
	}
	setEnabled(enabledValue){
	}
	setFocus(){
	}
}
 
class NpaUiComponent {
	config = null;
	parentDivId = null;
	constructor(parentDivId,configuration){
		this.parentDivId = parentDivId;
		this.config = configuration;
	}
	getId(){
		return this.config.id;
	}
	getConfiguration(){
		return this.config.configuration;
	}
	parentDiv(){
		return $('#'+this.parentDivId);
	}
	initialize(then){
		if(then){
			then();
		}
	}
	render(){
		console.log('NpaUiComponent#render() was called');
	}
	getLocalizedString(stringExpr,data=[]){
		return npaUi.getLocalizedString(stringExpr,data);
	}
	localize(reference,data,then){ //deprecated
		let values = '';
		for(var i=0;i<data.length;i++){
			if(i>0){
				values += ',';
			}
			values += data[i];
		}
		makeRESTCall('GET','/i18n/localize?ref='+reference+'&values='+values+'&locale='+navigator.language,{},function(response){
			then(response.text);
		});
	}
	localizeAndReplace(reference,data,id){ //deprecated
		this.localize(reference,data,function(localizedString){
			$('#'+id).html(localizedString);
		});
	}
	onItemSelected(item){
	}
}

class NpaUiComponentProxy {
	constructor(namespace,type,id,configuration){
		let instance = null;
		let toEval = 'instance = new '+namespace+'.'+type+'(id,configuration);';
		eval(toEval);
		return instance;
	}
}

class ItemRenderer {
	config = null;
	constructor(configuration){
		this.config = configuration;
	}
	render(item){
		// by default return the Type
		return typeof item;
	}
}

window.FieldItemRenderer = class FieldItemRenderer extends ItemRenderer{
	render(item){
		console.log('FieldItemRenderer#render()');
		if(typeof this.config.field!='undefined'){
			console.log('using field name '+this.config.field);
			return item[this.config.field];
		}else
		if(typeof this.config.processor!='undefined'){
			console.log('using processor '+this.config.processor);
			let result = '';
			let toEval = 'result = '+this.config.processor.replace(/@/g,'item')+';';
			try{
				eval(toEval);
			}catch(t){ console.log(t);}
			return result;
		}else
			return super.render(item);
	}
}

window.PrimitiveTypeItemRenderer = class PrimitiveTypeItemRenderer extends ItemRenderer{
	render(item){
		console.log('PrimitiveTypeItemRenderer#render()');
		return item;
	}
}

class ItemSorter {
	config = null;
	constructor(configuration){
		this.config = configuration;
	}
	sort(itemList){
		// by default return the original list
		return itemList;
	}
}

window.FieldItemSorter = class FieldItemSorter extends ItemSorter {
	sort(itemList){
		let sortedItemList = itemList;
		let ascending = false;
		if(typeof this.config.ascending!='undefined'){
			ascending = this.config.ascending;
		}
		try{
			sortedItemList = sortOn(itemList,this.config.field,!ascending);
		}catch(t){
			//?
		}
		return sortedItemList;
	}
}