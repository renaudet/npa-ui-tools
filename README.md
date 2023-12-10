# npa-ui-tools
UI Tools for NPA-based applications

NPA stands for Node Plugin Architecture and can be found [here](https://github.com/renaudet/Node-Plugin-Architecture).

This project adds a set of UI Tools, mostly based on Bootstrap v4.0 and jQuery, to ease the development of lightweight web applications.

The related plugins are package as an NPA's installation site, which means that it may be installed in a separate directory so that both project (NPA Core and npa-ui-tools) can evolve separately.

Once installed, edit the NPA Core's _appConfig.json_ file like this:

    { 
        "sites": [
            {
                "id": "default",
                "location": "./plugins"
            },
            {
                "id": "npa-ui-tools",
                "location": "<npa-ui-tools-install-location>/plugins"
            }
        ]
    }

so that NPA can load these plugins.