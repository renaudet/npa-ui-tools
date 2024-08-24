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

**Notice** that NPA requires some environment variable to be set before starting the application. Please, refer to the NPA's documentation for more details.

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

Then, NPA components are added to the page using `<div>` declarations by adding the  _npaUi_  class:

```html
<body>
	<div id="navBarPlaceholder" class="npaUi" data-config="/static/config/navBarConfig.json"></div>
	<div id="cardPlaceholder" class="npaUi" data-config="/static/config/cardConfig.json">
		<div>
			<div id="datatablePlaceholder" class="npaUi" data-config="/static/config/datatableConfig.json"></div>
			<div id="editorPlaceholder" class="npaUi" data-config="/static/config/editorConfig.json"></div>
		</div>
	</div>
	<div id="notifierPlaceholder" class="npaUi" data-config="/static/config/notifierConfig.json"></div>
	
	<script src="/js/jquery-3.6.3.min.js"></script>
	<script src="/js/bootstrap.bundle.min.js"></script>
	<script src="/uiTools/js/npaUiCore.js"></script>
	<script src="/static/js/homePage.js"></script>
</body>
```

Components are then configured using an external JSON configuration file defined by the  _data-config_  attribute.
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

Notice the callback  _onPageReady_  used to execute code once all the page components have been loaded and rendered properly.

As dynamically loading specific configuration files for each component on the page may have a severe impact in terms of performance, it is possible to put the component configurations in a single JSON file using a named reference like this:

```json
{
    "myCardReference": {
	    "id":"card_01",
	    "version": "1.0.0",
	    "type": "npaTest.Card",
	    "configuration": {
	        ...
	    }
    }
}
```

The JSON file may be loaded by the npaUi runtime the following way:

```javascript
$(document).ready(function(){
	npaUi.loadConfigFrom('<path to json file>.json',function(){
	    npaUi.initialize(function(){
	        npaUi.onComponentLoaded = onPageReady;
	        npaUi.render();
	    });
    });
});
```

In the html page, NPA.ui components should now use a data-ref instead of a data-config:
  
```html
<body>
	<div id="navBarPlaceholder" class="npaUi" data-ref="myNavbarReference"></div>
	<div id="cardPlaceholder" class="npaUi" data-ref="myCardReference">
		<div>
			<div id="datatablePlaceholder" class="npaUi" data-ref="myDatatableReference"></div>
			<div id="editorPlaceholder" class="npaUi" data-ref="myEditorReference"></div>
		</div>
	</div>
	<div id="notifierPlaceholder" class="npaUi" data-ref="myNotifierReference"></div>
	<script src="/js/jquery-3.6.3.min.js"></script>
	<script src="/js/bootstrap.bundle.min.js"></script>
	<script src="/uiTools/js/npaUiCore.js"></script>
	<script src="/static/js/homePage.js"></script>
</body>
```

## Built-in components

### NavBar

**Description:**

NavBar components are top-level components for the HTML Page that provide branding and menu facilities

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
    "id":"<component-id>",
    "version": "1.0.0",
    "type": "NavBar",
    "configuration": {
        "icon": "<path-to-upper-left-application-icon>",
        "applicationName": "<application-title-on-the-navbar>",
        "homeRef": "<Home page URI>",
        "menus": [
        	{
        		"id": "<menu-id>",
        		"label": "<leave-blank-for-icon-only>",
        		"actionId": "<action-id-for-this-menu>",
        		"tooltip": "save",
		      "icon": "<icon-path-for-the-menu>"
        	},
        	{
        		"id": "<menu-id>",
        		"label": "<menu-label-visible-on-the-navbar>",
        		"items": [
        			{
        				"id": "<menu-item-id>",
		        		"label": "<menu-item-label>",
		        		"actionId": "<action-id-for-this-menu-item>",
		        		"icon": "<icon-path-for-the-menu-item>"
        			},
        			{
        				"type": "separator"
        			},
        			{
        				"id": "<menu-item-id>",
		        		"label": "<menu-item-label>",
		        		"actionId": "<action-id-for-this-menu-item>",
        				"tooltip": "<tooltip/description-for-this-menu-item>",
		        		"icon": "icon-path-for-the-menu-item"
        			}
        		]
        	}
        ]
    }
}
```

### Card

**Description:**

A Card is a component container with a header, a body and footer. Child components are contained within the body.

The header can be customized with and icon ond title, making it perfect to act as the container for an inner application page.

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>">
	<div>
		[...] <!-- some other inner components -->
	</div>
</div>
```

**JSON Configuration file**

```json
{
    "id":"<component-id>",
    "version": "1.0.0",
    "type": "Card",
    "configuration": {
        "icon": "<path-to-card-icon>",
        "label": "<label/title-for-this-card>"
    }
}
```

### Toolbar

**Description:**

A Toolbar is a ruban-like rectangular area containing several icons aimed at providing button-like access to features through  _action_  events

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
	"id":"<component-id>",
	"version": "1.0.0",
	"type": "Toolbar",
	"configuration": {
		"actions": [
			{
				"label": "<Tooltip-label-for-the-icon>",
				"actionId": "<action-id-for the icon>",
				"icon": "<path-to-icon>"
			},
			{
				"type": "separator"
			},
			{
				"label": "<Tooltip-label-for-the-icon>",
				"actionId": "<action-id-for the icon>",
				"icon": "<path-to-icon>"
			}
		]
	}
}
```

An action icon may have a lifecycle depending on selection events. For example, the initial state may be `"enabled": false`  and in this case the corresponding button is de-activated.

In such a case, it is up to the developer to programmaticaly activate the button and its corresponding action by using the Toolbar API:

```javascript
let toolbar = npaUi.getComponent(<toolbar-id>);
toolbar.setEnabled(<action-id>,true/false);
```

But there is also a possibility to have the Toolbar itself listening to selection events and makes the actions automaticaly react to such events.

First, we configure the Toolbar to be a SelectionListener and specify the component ID for the SelectionProvider:


```json
{
	"id":"<component-id>",
	"version": "1.0.0",
	"type": "Toolbar",
	"configuration": {
    	"selectionListener": true,
    	"selectionProvider": "<some SelectionProvider component's ID>",
		"actions": [
			{
				"label": "<Tooltip-label-for-the-icon>",
				"actionId": "<action-id-for the icon>",
				"icon": "<path-to-icon>",
				"enabled": false
			}
		]
	}
}
```

Then, we specify the behavior of the action upon receiving a SelectionEvent:

```json
{
	"id":"<component-id>",
	"version": "1.0.0",
	"type": "Toolbar",
	"configuration": {
    	"selectionListener": true,
    	"selectionProvider": "<some SelectionProvider component's ID>",
		"actions": [
			{
				"label": "<Tooltip-label-for-the-icon>",
				"actionId": "<action-id-for the icon>",
				"icon": "<path-to-icon>",
				"enabled": false,
				"enableOnSelection": true
			}
		]
	}
}
```

This way, the action is only enabled when an item has been selected by the SelectionProvider.

An advanced configuration is to have the Toolbar manage automaticaly activation / deactivation of buttons depending on actions being previously fired:

```json
{
	"id":"<component-id>",
	"version": "1.0.0",
	"type": "Toolbar",
	"configuration": {
    	"selectionListener": true,
    	"selectionProvider": "<some SelectionProvider component's ID>",
		"actions": [
			{
				"label": "Action Btn 1",
				"actionId": "action1",
				"icon": "<path-to-icon1>",
				"enabled": false,
				"enableOnSelection": true
			},
			{
				"label": "Action Btn 2",
				"actionId": "action2",
				"icon": "<path-to-icon2>",
				"enabled": false
			}
		],
    	"pluggableActionHandlers": [
    		{
    			"actionId": "action1",
    			"handlerExpr": "@.setEnabled('action2',true);"
    		}
    	]
	}
}
```

With such configuration, the action button  _action1_  is enabled by the Toolbar after some SelectionProvider emitted an onSelection event. Then, once the user clicked on this button, the action button  _action2_  is automatically enabled by the Toolbar. This behavior is typically the example of an editing Toolbar with a 'edit' action (as action1) and a 'save' action (as action2)

### Notifier

**Description:**

A Notifier provides an elegant way of displaying notifications on the side of the Window. Notifications may be information, warning, confirmation or error. Information, Warning and Error types are persistent on the screen unless the user click on the closing cross in the notification header.

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
    "id":"<component-id>",
    "version": "1.0.0",
    "type": "Notifier",
    "configuration": {
    }
}
```
The Notifier framework provides a set of APIs to triggers notifications:

```javascript
showInfo(msg,data=[]);
showWarning(msg,data=[]);
showError(msg,data=[]);
showConfirm(msg,data=[]);
flash(msg,data=[]);
```
This API supports localization and automatic insertion of string fragments in translated messages:

```javascript
showError('@myComponent.error.msg',['value1','value2']);
```

### SelectionList

**Description:**

A SelectionList provides a left-side selection area where items may be selected. The SelectionList provides a Title and an optional filter area to filter the items in the list.

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
	"id":"<component-id>",
	"version": "1.0.0",
	"type": "SelectionList",
	"configuration": {
		"header": {
			"title": "<some localized string>",
			"showFilter": true/false
		},
		"datasource": {
			"type": "managed",
			"manager": "<data-manager-id>"
		},
		"renderer": {
			"type": "FieldItemRenderer",
			"processor": "@.name"
		},
		"sorter": {
			"type": "FieldItemSorter",
			"field": "name",
			"ascending": false
		}
	}
}
```

In this configuration file the  _data-manager-id_  refers to a Datamanager type of UiTools component (non-graphic component).

The  _renderer_  section refers to the way items provided by the datasource are to be represented in the selection list. The provided  _FieldItemRenderer_  is a subclass of  _ItemRenderer_  provided by the framework. It can use a specific 'field' attribute or a 'processor'. In our example, `"field": "name"` is equivalent to  `"processor": "@.name"`.

A 'processor' is much more powerfull as it enables the combination of several item field values with HTML elements to provide the result.

For example:

```json
	[...]
		"renderer": {
			"type": "FieldItemRenderer",
			"processor": "'<span><img src=\"/uiTools/img/silk/application_form.png\">&nbsp;'+@.name+'&nbsp;'+@.age+'</span>'"
		},
	[...]
```

### Form

**Description:**

Form is one of the most advanced component provided by the UiTools framework.

A Form is actualy an HTML form with advanced behavior as automatic validation and triggered behavior. It is based on a list of  _fields_ , each with its own specific configuration.

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
    "id":"<component-id>",
    "version": "1.0.0",
    "type": "Form",
    "configuration": {
    	"title": "<an-optional-title>"
    	"class": "form-frame-noborder",
    	"selectionListener": true/false,
    	"selectionProvider": "<some SelectionProvider ID>",
    	"fields": [
    		{
    			"name": "name",
    			"label": "@my.form.field.name",
    			"type": "text",
    			"required": true,
    			"size": 4
    		}
    	]
    }
}
```

Each field *type* has its own specific configuration. There are some common attributes though:

#### common attributes

> **name**: the attribute name in the target data object edited by the form

> **label**: a localization-capable label for displaying purpose

> **type**: the type for the attribute. Defaults to `text`


#### text

This is the default type and features a Text input field. It also accepts the following attributes:

> **size**: size of the input field in 1/12 of the form width. From 1 to 10

> **required**: whether the field is required or not. If required, null or blank values are not accepted

> **default**: a default value for the field

> **placeholder**: a string that will be displayed inside the input field while empty to precise the expected value for the field

> **help**: a localization-capable string to describe the use of the underlying field

Text-type fields are equivalent to password-type fields, except the content is showing

#### integer

Features a Numeric input field. It also accepts the following attributes:

> **size**: size of the input field in 1/12 of the form width. From 1 to 10

> **required**: whether the field is required or not. If required, null or non-numerical values are not accepted

> **default**: a default value for the field

> **placeholder**: a numerical value that will be displayed inside the input field while empty to precise the expected value for the field

> **help**: a localization-capable string to describe the use of the underlying field

#### date

Features a Date input field with a calendar popup that helps select values. It also accepts the following attributes:

> **size**: size of the input field in 1/12 of the form width. From 1 to 10

> **required**: whether the field is required or not. If required, null values are not accepted

> **help**: a localization-capable string to describe the use of the underlying field

> **style**: a CSS style to further customize the rendering of the date field

#### option / check / switch

Features an option field with a checkbox or a switch rendering. It also accepts the following attributes:

> **default**: a default value for the field

> **help**: a localization-capable string to describe the use of the underlying field

#### radio

Features an option field with several values and an exclusive choice mechanism (aka radio buttons). It also accepts the following attributes:

> **default**: the default value for the field - must be within the proposed choices

> **choices**: an array of {"label": "some label","value": "some value"} objects

#### color

Features a color picker to visualy select a 24 bits color in `#xxxxxx` format. It also accepts the following attributes:

> **default**: a default color value for the field

> **help**: a localization-capable string to describe the use of the underlying field

#### range

Features a range slider to visualy select a numerical value between a minimum and a maximum. It also accepts the following attributes:

> **size**: size of the slider field in 1/12 of the form width. From 1 to 9

> **default**: a default value for the field

> **help**: a localization-capable string to describe the use of the underlying field

> **min**: the minimum value for the field

> **max**: the maximum value for the field

> **step**: the incremental step value for the slider

#### select

Features a select field where selectable values can be fixed or items provided by a datasource. It also accepts the following attributes:

> **size**: size of the slider field in 1/12 of the form width. From 1 to 10

> **help**: a localization-capable string to describe the use of the underlying field

> **required**: whether the field is required or not. If required, the first value in the list is selected by default

> **values**: an array of {"label": "some label","value": "some value"} objects - mutualy exclusive with the datasource attribute

> **datasource**: a datasource configuration. Either `local` or `managed` (see below)

> **renderer**: a renderer configuration for labels and values (see below)

Example:

```json
	[...]
    		{
    			"name": "selectField_1",
    			"label": "@my.form.field.name1",
    			"type": "select",
    			"required": true,
    			"size": 6,
    			"values": [{"label": "@my.form.field.label1", "value": "value_1"},{"label": "@my.form.field.label2", "value": "value_2"}]
    		}
	[...]
    		{
    			"name": "selectField_2",
    			"label": "@my.form.field.name2",
    			"type": "select",
    			"size": 4,
    			"datasource": {
	            "type": "managed",
	            "manager": "<datamanager-id>"
				},
				"renderer": {
					"label": {
						"type": "FieldItemRenderer",
						"processor": "@.description"
					},
					"value": {
						"type": "FieldItemRenderer",
						"processor": "@.name"
					}
				}
    		}
}
```

In the last example, the Select field display the `description` attribute of the items provided by the datasoure but use the `name`attribute as the value for the underlying field

#### json or javascript

Features a code editor for JSON or javascript content data. It also accepts the following attributes:

> **buttons**: an array of button object definition {"actionId": "<associated action ID>","icon": "icon-uri","label": "<a localization-capable string>"}

> **height**: initial height of the editor in pixel

Notice that a `json` type field will be validated so that its content may be parsed as a valid JSON object

#### textarea

Features a textarea input field. It also accepts the following attributes:

> **size**: size of the slider field in 1/12 of the form width. From 1 to 10

> **style**: a CSS style to apply to further decorate the input field such as font-family

> **rows**: the number of rows to display

#### array

Features an editor for an array field. It also accepts the following attributes:

> **datatype**: one of text / integer / object - will be extended to custom datatypes in the future

> **rows**: the number of rows to be displayed on the select list

> **editable**: true/false

#### datatype

Features an inner editor for a object field of type `datatype`. It also accepts the following attributes:

> **size**: size of the slider field in 1/12 of the form width. From 1 to 10

> **siteId**: an html id for the <div> hosting the inner form

> **formRef**: a reference to an inner form component dedicated to edit this field

#### upload

Features an input field of type file that enables local file selection for upload to the server. It also accepts the following attributes:

> **uploadButtonLabel**: a localization-capable string used as the label for the upload button

> **actionId**: identifier of the action that is triggered while the end-user click on the upload button

Notice that this input field has no action on the form's underlying data object

#### button

Features an button object that can be associated with an action. It also accepts the following attributes:

> **buttonType**: the Bootstrap type of button, one of btn-primary / btn-secondary / btn-success/ btn-danger/ btn-warning / btn-info / btn-light / btn-dark / btn-link

> **actionId**: identifier of the action that is triggered while the end-user click on the button

Notice that this field has no action on the form's underlying data object

#### placeholder

Features a placeholder html <div> so that html content can insert in this place. It also accepts the following attributes:

> **size**: size of the slider field in 1/12 of the form width. From 1 to 10

> **siteId**: an html id for the <div>

Notice that this field has no action on the form's underlying data object

#### reference

Features a single or multiple (array) reference for other data objects . It also accepts the following attributes:

> **multiple**: true/false. Whether the reference is unique or is an array of references

> **help**: a localization-capable string to describe the use of the underlying field - single reference only

> **unique**: true/false. For multiple reference, precise that the same item cannot be added twice in the array.

> **datasource**: a datasource configuration. Either `local` or `managed` (see below)

> **renderer**: a renderer configuration for items in the selection list

Example:

```json
	[...]
    		{
    			"name": "referenceField_1",
    			"label": "@my.form.field.name1",
    			"type": "reference",
    			"multiple": false,
    			"size": 6,
    			"datasource": {
	            "type": "managed",
	            "manager": "<datamanager-id>"
				},
				"renderer": {
					"title": {
						"type": "FieldItemRenderer",
						"processor": "@.description"
					},
					"value": {
						"type": "FieldItemRenderer",
						"processor": "@.name"
					}
				}
    		}
	[...]
}
```

#### richText

Features a RichText editor. It also accepts the following attributes:

> **buttons**: an array of button object definition {"actionId": "<associated action ID>","icon": "icon-uri","label": "<a localization-capable string>"}

> **height**: the initial height (in pixel) for the editor. Defaults to 300

> **width**: the initial width (in pixel) for the editor. Defaults to 800


### Component-id

**Description:**

	<put-some-description-here>

**Integration:**

**HTML**

```html
<div id="<some-unique-id>" class="npaUi" data-config="<path-to-config.json>"></div>
```

**JSON Configuration file**

```json
{
    "id":"<component-id>",
    "version": "1.0.0",
    "type": "<component-id>",
    "configuration": {
        [...]
    }
}
```

