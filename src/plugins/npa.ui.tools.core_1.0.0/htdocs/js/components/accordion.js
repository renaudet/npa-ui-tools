/*
 * accordion.js - NPA UI Tools Core component framework's Accordion component'
 * Copyright 2026 Nicolas Renaudet - All rights reserved
 */
 
npaUiCore.Accordion = class Accordion extends NpaUiComponent{
	initialize(then){
		if(this.getConfiguration().stylesheet){
			$.loadCss(this.getConfiguration().stylesheet,then);
		}else{
			$.loadCss('/uiTools/css/accordion.css',then);
		}
	}
	render(then){
		let config = this.getConfiguration();
		if(this.parentDiv().data('loaded')!='true'){
			let childs = {};
			$('#'+this.parentDivId+' div').each(function(){
				if(typeof $(this).data('section')!='undefined' && 
				   $(this).data('section')!=null && 
				   $(this).data('section').length>0){
					console.log('detaching child DIV with section id: '+$(this).data('section'));
					childs[$(this).data('section')] = $(this).detach();
				}
			});
			
			let html = '';
			html += '<div id="'+this.getId()+'" class="accordion">';
			
			for(var i=0;i<config.sections.length;i++){
				let section = config.sections[i];
				//let sectionId = this.getId()+'_section_'+i;
				let sectionId = this.getId()+'_section_'+section.id;
				html += '<div class="accordion-item">';
				html += '<h2 class="accordion-header accordion-header-sm">';
				html += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#'+sectionId+'" aria-expanded="true" aria-controls="'+sectionId+'">';
				html += section.label;
				html += '</button>';
				html += '</h2>';
				let showValue = i==0?'show':'';
				html += '<div id="'+sectionId+'" class="accordion-collapse collapse '+showValue+'" data-bs-parent="#'+this.getId()+'">';
				html += '  <div class="accordion-body" id="'+sectionId+'_body">';
				html += '  </div>';
				html += '</div>';
				html += '</div>';
			}
			
			html += '</div>';
			this.parentDiv().html(html);
			
			let appendChild = function(child,targetId,namespace){
				setTimeout(function(){ $(targetId).append(child);npaUi.render(namespace);},800);
			}

			for(var sectionId in childs){
				let div = childs[sectionId];
				let targetDivId = this.getId()+'_section_'+sectionId;
				console.log('attaching child DIV with section id '+sectionId);
				console.log('child is:\n'+div.html());
				console.log('target div ID is '+'#'+targetDivId);
				$('#'+targetDivId).empty();
				let firstChild = div.children('div:first-child');
				if(firstChild.attr('class') && firstChild.attr('class').length>0){
					var classList = firstChild.attr('class').split(/\s+/);
					let namespace = (classList && classList.length>0)?classList[0]:'npaUi';
					appendChild(firstChild,'#'+targetDivId,namespace);
				}else{
					$('#'+targetDivId).append(div);
				}
			}
			
			then();
		}else{
			then();
		}
	}
}