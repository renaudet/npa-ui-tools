/*
 * carousel.js - NPA UI Tools Core component framework's Carousel component'
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Carousel = class Carousel extends NpaUiComponent{
	initialize(then){
		$.loadCss('/uiTools/css/carousel.css',then);
	}
	render(){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let childs = {};
			$('#'+this.parentDivId+' div').each(function(){
				if(typeof $(this).data('slide-target')!='undefined' && 
				   $(this).data('slide-target')!=null && 
				   $(this).data('slide-target').length>0){
					console.log('detaching child DIV with target: '+$(this).data('slide-target'));
					childs[$(this).data('slide-target')] = $(this).detach();
				}
			});
			let html = '';
			html += '<div id="'+this.getId()+'" class="carousel slide npa-carousel-header">';
			html += '<div id="'+this.getId()+'_inner" class="carousel-inner npa-carousel-inner">';
			for(var i=0;i<config.slides.length;i++){
				let slide = config.slides[i];
				let active = true;
				if(typeof slide.active!='undefined' && !slide.active){
					active = false;
				}
				html += '<div id="'+slide.id+'" class="carousel-item'+(i==0?' active':'')+'">';
				html += '<div class="row">';
				html += '<div class="col-2">&nbsp;</div>';
				html += '<div class="col-8" id="'+slide.id+'_content"></div>';
				html += '<div class="col-2">&nbsp;</div>';
				html += '</div>';
				html += '</div>';
			}
			html += '<button class="carousel-control-prev" type="button" data-bs-target="#'+this.getId()+'" data-bs-slide="prev">';
			html += '  <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
			html += '  <span class="visually-hidden">Previous</span>';
			html += '</button>';
			html += '<button class="carousel-control-next" type="button" data-bs-target="#'+this.getId()+'" data-bs-slide="next">';
			html += '  <span class="carousel-control-next-icon" aria-hidden="true"></span>';
			html += '  <span class="visually-hidden">Next</span>';
			html += '</button>';
			html += '</div>';
			html += '</div>';
			this.parentDiv().html(html);
			this.stretch();
			for(var slideId in childs){
				let div = childs[slideId];
				console.log('attaching child DIV with target '+slideId);
				$('#'+slideId+'_content').empty();
				$('#'+slideId+'_content').append(div);
			}
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