/*
 * npaUtil.js - NPA plugin adapter class for external installation site
 * Copyright 2023 Nicolas Renaudet - All rights reserved
 */

const Plugin = require(process.cwd()+'/core/plugin.js');

class UIPlugin extends Plugin{
	getService(name){
		var core = this.runtime.getPlugin('npa.core');
		return core.getService(name);
	}
}

module.exports = UIPlugin;