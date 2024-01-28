/*
 * page3.js - main javascript resource for the NPA Test Application Page 3
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 */
 
$(document).ready(function(){
	npaUi.loadConfigFrom('/static/config/globalConfig.json',function(){
		npaUi.initialize(function(){
			//npaUi.on('displayMessage',displayMessage);
			npaUi.render();
		});
	});
});