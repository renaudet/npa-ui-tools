/*
 * npaUiComponentModel.js - NPA UI Tools Core component object model
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
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