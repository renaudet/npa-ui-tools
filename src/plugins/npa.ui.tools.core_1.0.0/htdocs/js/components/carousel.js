/*
 * carousel.js - NPA UI Tools Core component framework's Carousel component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
const DATA_SLIDE_ID_ATTR = 'slide-id';
 
npaUiCore.Carousel = class Carousel extends NpaUiComponent{
	initialize(then){
		if(this.getConfiguration().stylesheet){
			console.log('Carousel: using stylesheet from '+this.getConfiguration().stylesheet);
			$.loadCss(this.getConfiguration().stylesheet,then);
		}else{
			console.log('Carousel: using default stylesheet');
			$.loadCss('/uiTools/css/carousel.css',then);
		}
	}
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let childs = {};
			$('#'+this.parentDivId+' div').each(function(){
				if(typeof $(this).data(DATA_SLIDE_ID_ATTR)!='undefined' && 
				   $(this).data(DATA_SLIDE_ID_ATTR)!=null && 
				   $(this).data(DATA_SLIDE_ID_ATTR).length>0){
					childs[$(this).data(DATA_SLIDE_ID_ATTR)] = $(this).detach();
				}
			});
			let transitionStyle = '';
			if(typeof config.transitionStyle!='undefined' && 'fade'==config.transitionStyle){
				transitionStyle = 'carousel-fade ';
			}
			let autoPlay = '';
			if(typeof config.autoPlay!='undefined' && config.autoPlay==true){
				autoPlay = ' data-bs-ride="carousel"';
			}
			let html = '';
			html += '<div id="'+this.getId()+'" class="carousel slide '+transitionStyle+'npa-carousel-header"'+autoPlay+'>';
			html += '<div id="'+this.getId()+'_inner" class="carousel-inner npa-carousel-inner">';
			html += '</div>';
			html += '</div>';
			this.parentDiv().html(html);
			this.stretch();
			let i=0;
			for(var slideId in childs){
				let div = childs[slideId];
				html = '';
				html += '<div id="'+slideId+'" class="carousel-item'+(i==0?' active':'')+'">';
				html += '  <div class="row">';
				html += '    <div class="col-2">&nbsp;</div>';
				html += '    <div class="col-8" id="'+slideId+'_content"></div>';
				html += '    <div class="col-2">&nbsp;</div>';
				html += '  </div>';
				html += '</div>';
				$('#'+this.getId()+'_inner').append(html);
				$('#'+slideId+'_content').append(div);
				i++;
			}
			html = '';
			html += '<button class="carousel-control-prev" type="button" data-bs-target="#'+this.getId()+'" data-bs-slide="prev">';
			html += '  <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
			html += '  <span class="visually-hidden">Previous</span>';
			html += '</button>';
			html += '<button class="carousel-control-next" type="button" data-bs-target="#'+this.getId()+'" data-bs-slide="next">';
			html += '  <span class="carousel-control-next-icon" aria-hidden="true"></span>';
			html += '  <span class="visually-hidden">Next</span>';
			html += '</button>';
			$('#'+this.getId()+'_inner').append(html);
			then();
		}else{
			then();
		}
	}
	stretch(){
		let config = this.getConfiguration();
		if(typeof config.expandsTo!='undefined'){
			$('#'+this.getId()+'_inner').height($('#'+config.expandsTo).height()-30);
			let carousel = this;
			$(window).on('resize',function(){
				$('#'+carousel.getId()+'_inner').height($('#'+config.expandsTo).height()-30);
			});
		}
	}
}