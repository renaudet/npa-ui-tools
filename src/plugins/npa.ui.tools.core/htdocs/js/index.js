/*
 * index.js - main javascript resource for the index.html test page
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */
 
$(document).ready(function(){
	npaUi.initialize(function(){
		npaUi.onComponentLoaded = onPageReady;
		npaUi.render();
	});
});

onPageReady = function(){
	showConfirm('Notifier component has been loaded!');
}