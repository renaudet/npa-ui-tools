/*
 * npaUiCore.js - NPA UI Tools Core component framework
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */

npaUi = {
    render: function(){
        $('.npaUi').each(function(){
            let c = $(this);
            console.log('rendering component #'+c.attr('id'));
            let configFile = c.data('config');
            console.log('configuration file: '+configFile);
        });
    }
}