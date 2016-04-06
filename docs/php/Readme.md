# Project file structure

- ./plugin-wordpress.php - initial WordPress plugin which supports PHP 5.0+
- ./bootstrap/autoload.php - System bootstraper, initializes \VisualComposer\Application instance and bootstraps system:
	* wp action `vcv:load` called `[\VisualComposer\Application::__construct]` Before all modules registred
	    ( this will allow to register own module: [not tested]

	    ```php
	    add_action('vcv:load', function($vcapp){ 
	        $vcapp->modules['my3rdmodules'=>'myNamespace'];
	    });
	    ```
	    
	* wp action `vcv:boot` called `[\VisualComposer\Application::boot]` After all modules instances created
- ./visualcomposer/Framework - contains Lumen microframework classes (Application, Illuminate events and container)
	* Note: framework was modified for vcapp() helper and strip out all unneded files/classes/functions
	* Note: Events library based on Illuminate/Events but it was modificated to allow use Method Injection

- ./visualcomposer/Helpers - contains VisualComposer helpers:
    * for Generic use (not platform depended mostly) like: Url, Templates, Data, Request (similar to Illuminate/Request
     but much simpler)
    * for WordPress shorthards like Options->get, set Nonce and other WordPress related helpers
    * for Some Modules shorthands [visualcomposer/Helpers/SomeModule/...]
- ./visualcomposer/Modules - contains VisualComposer modules:
	* Modules structure is not strict, you can use sub modules (e.g. look into Settings/Pages) and other
	* Modules defines all logic for system
	* All modules should contain Controller
- ./visualcomposer/Application.php - visual composer core application instance, contains all modules/helpers instances 
	and aliases
- ./visualcomposer/Requirements.php - php 5.1 parseable script for system requirements checks. (check php version 
	and wp version)
- ./visualcomposer/resources/* - contains assets and views for modules/helpers
- ./ajax.php - just a shortcut for ./visualcomposer/Modules/System/Loader.php - used in custom plugin ajax request call

## Differences between Helpers and Modules
- Helpers and Modules by default are __singletons__ [for performance]
- Helpers doesn't have logic for action listeners (like WordPress actions/filters)
- Helpers doesn't have events listeners
	- This is the reason Why `Access`, `CurrentUserAccess` and `RoleAccess` was Helpers
- Helpers contains only API for processing some data or retreive some result
- Helpers are __PUBLIC__, this means it __SHOULD__ be used by other theme/plugins developers
- Helpers are __NOT__ automaticaly instatiated, but Modules does
- Module can have own helper to process Public API
- Module __SHOULD__ be __PROTECTED__ access, this means other theme/plugins developers __SHOULD NOT__ not use modules
   as API, instead they __SHOULD__ use Modules __PUBLIC__ Api in
    `\VisualComposer\Helpers\HelperName..`

