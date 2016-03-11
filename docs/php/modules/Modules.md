#Modules
Modules is system main logic, they controls proccess flow and determines actions for events

#Currently registred modules

- List:

	    // system s & subs
	    'activation' => 'VisualComposer\Modules\System\Activation\Controller',
	    'textDomain' => 'VisualComposer\Modules\System\TextDomain\Controller',
	    // Editors s & subs
	    'assetsManager' => 'VisualComposer\Modules\Editors\AssetsManager\Controller',
	    'dataAjax' => 'VisualComposer\Modules\Editors\DataAjax\Controller',
	    'frontendEditor' => 'VisualComposer\Modules\Editors\Frontend\Frontend',
	    'pageEditable' => 'VisualComposer\Modules\Editors\Frontend\PageEditable',
	    // Live/Public
	    'live' => 'VisualComposer\Modules\Live\Controller',
	    // Elements
	    'ajaxElementRender' => 'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',
	    // License
	    'license' => 'VisualComposer\Modules\License\Controller',
	    // Settings & Settings Pages
	    'settings' => 'VisualComposer\Modules\Settings\Controller',
	    'settingsPageGeneral' => 'VisualComposer\Modules\Settings\Pages\General',
	    'settingsPageLicense' => 'VisualComposer\Modules\Settings\Pages\License',
	    'settingsPageRoles' => 'VisualComposer\Modules\Settings\Pages\Roles',
	    'settingsPageAbout' => 'VisualComposer\Modules\Settings\Pages\About',

##Modules descriptions
- All modules should be determine description inside phpDocBlocks on top of Controller


##Module creation:
- Location:
	- ./visualcomposer/Modules/*
	- e.g. ./visualcomposer/Modules/SaveManager/Controller.php
- Registration:
	- Add a moduleName=>moduleNameSpace/Controller into file `visualcomposer/Application.php` $modules variable
	- moduleName __SHOULD__ be simillar to namespace without "module" prefix
	- moduleName __MUST__ be lowerCamelCase type
	- e.g. 'saveManager'=>'VisualComposer\Modules\SaveManager\Controller'

##Module constraints:
- All registred modules and helpers are singletons (which registred in $modules variable)
- All registred modules __MUST__ have namespace on top Like: VisualComposer\Modules\MyModule
- ONLY one class per file And other PSR2 constraints
- Module controller file __MUST__ create class Controller
- Module Controller class __MUST__ extend `VisualComposer\Framework\Container` (this will allow to use `$this->call()` and method injection)

##Controller methods and injections:
- All helpers and modules registred in system have dependency injection feature
	* You are able to use it in `__construct()` by default like: `public function __construct( \VisualComposer\Helpers\Generic\Request $request, \VisualComposer\Helpers\Generic\Templates $templates )`
	* Using of dependency injection will return same object always
- All helpers and modules can be accessed by `vcapp()` function call:
	* `vcapp()` itself returns VisualComposer\Application instance
	* `vcapp('helperNameHelper')` returns VisualComposer\Helpers\... singleton instance
	* `vcapp('moduleName')` return VisualComposer\Modules\... singleton instance
	
- Methods injection also is available simillar like in Laravel : `public function myMethod( \VisualComposer\Helpers\Generic\Request $request, \VisualComposer\Helpers\Generic\Templates $templates )`
	* Note: That myMethod should be called by `$this->call('methodName', $args=[] );`
	* Note: Methods can be also private

##Events usage:
- All events is provided by `VisualComposer/Framework/Illuminate/Contracts/Dispatcher` class
- Same logic as in Laravel with `$dispatcher->listen()` and `$dispatcher->fire()`

##Resources like views(templates) usage:
- Location: `visualcomposer/resources/views`
- Views path __MUST__ be simillar to the module path ( e.g. visualcomposer/resources/views/saveManager/template.php )
- Template can be rendered by `\VisualComposer\Helpers\Generic\Templates` helper:
	* `vcapp('templatesHelper')`
	* method/DI injection like: `public function __construct( \VisualComposer\Helpers\Generic\Templates $templatesHelper )`
	* e.g: `$templatesHelpers->render( $relativePathToTemplate, $args=[], $doEcho = true)`;
	
##Best practices:
- In templates is better to use `vcapp('...')` shortcut
- In method that is called by public/wordpress actions also better to use `vcapp('..')` shortcut
- All other cases better to use DI or Method injection `private function myMethod( SomeOtherHelperOrModule $object )`
- Good when most of inner methods call was called by `$this->call()` __this will allow to use method injection__
