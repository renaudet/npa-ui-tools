# npa-ui-tools
UI Tools for NPA-based applications

NPA stands for Node Plugin Architecture and can be found [here](https://github.com/renaudet/Node-Plugin-Architecture).

This project adds a set of UI Tools, mostly based on Bootstrap v4.0 and jQuery, to ease the development of lightweight web applications.

## Installation

The related plugins are package as an NPA's installation site, which means that it may be installed in a separate directory so that both project (NPA Core and npa-ui-tools) can evolve separately.

Once installed, edit the NPA Core's _appConfig.json_ file like this:

```json
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
```

so that NPA can load these plugins.

Start the NPA server on the test application with a command-line like:

    $>node app.js --application test --port 9080

Then open your browser on url http://localhost:9080/

## Develop with NPA UI

NPA UI uses externaly defined Components that can be configured through JSON files.

The base page should include the necessary dependencies: jQuery, Bootstrap, and the provided npaUiCore.js library:

```html
<!doctype html>
<html>
    <head>
        <meta charset="ISO-8859-1">
        <meta http-equiv="Content-Type" content="text/html; ISO-8859-1">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Content-Style-Type" content="text/css">
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link href="/css/bootstrap.min.css" rel="stylesheet">
        <title>NPA test page</title>
    </head>
    <body>
        <script src="/js/jquery-3.6.3.min.js"></script>
        <script src="/js/bootstrap.bundle.min.js"></script>
        <script src="/uiTools/js/npaUiCore.js"></script>
    </body>
</html>
```

Then, NPA components are added to the page using `<div>` declarations by adding the _npUi_ class:

```html
<body>
	<div id="navBarPlaceholder" class="npaUi" data-config="/static/config/navBarConfig.json"></div>
	<div id="cardPlaceholder" class="npaUi" data-config="/static/config/cardConfig.json">
		<div>
			<div id="datatablePlaceholder" class="npaUi" data-config="/static/config/datatableConfig.json"></div>
			<div id="editoPlaceholder" class="npaUi" data-config="/static/config/editorConfig.json"></div>
		</div>
	</div>
	<div id="notifierPlaceholder" class="npaUi" data-config="/static/config/notifierConfig.json"></div>
	
	<script src="/js/jquery-3.6.3.min.js"></script>
	<script src="/js/bootstrap.bundle.min.js"></script>
	<script src="/uiTools/js/npaUiCore.js"></script>
	<script src="/static/js/homePage.js"></script>
</body>
```

Components are then configured using an external JSON configuration file defined by the _data-config_ attribute.
Such JSON configuration file provides some basic metadata:

```json
{
    "id":"card_01",
    "version": "1.0.0",
    "type": "Card",
    "configuration": {
        ...
    }
}
```

The runtime will use these metadata to load the right component (here `Card`) at the right version (here `1.0.0`).
Notice that the component is by default looked for in the default namespace. To specifiy an alternate namespace, one must prefix the component name with the namespace followed by a single dot:

```json
{
    "id":"card_01",
    "version": "1.0.0",
    "type": "npaTest.Card",
    "configuration": {
        ...
    }
}
```

The `configuration` section is component-dependent and might be completely different from one component to another.

In the main javascript file for the page, the runtime may be called from the `$(document).ready()` callback:

```javascript
$(document).ready(function(){
    npaUi.initialize(function(){
        npaUi.onComponentLoaded = onPageReady;
        npaUi.render();
    });
});
```

