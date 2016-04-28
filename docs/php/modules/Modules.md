#Modules
Modules is system main logic, they controls proccess flow and determines actions for events

#Currently registred modules

- List:

	    // system s & subs
	    'SystemActivationController' => 'VisualComposer\Modules\System\Activation\Controller',
	    'SystemTextDomainController' => 'VisualComposer\Modules\System\TextDomain\Controller',
	    // Editors s & subs
	    'EditorsAssetsManagerController' => 'VisualComposer\Modules\Editors\AssetsManager\Controller',
	    'EditorsDataAjaxController' => 'VisualComposer\Modules\Editors\DataAjax\Controller',
	    'EditorsFrontendController' => 'VisualComposer\Modules\Editors\Frontend\Controller',
	    'EditorsPageEditableController' => 'VisualComposer\Modules\Editors\PageEditable\Controller',
	    // Live/Public
	    'SiteController' => 'VisualComposer\Modules\Site\Controller',
	    // Elements
	    'ElementsAjaxShortcodeRenderController' => 'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',
	    // License
	    'LicenseController' => 'VisualComposer\Modules\License\Controller',
	    // Settings & Settings Pages
	    'SettingsController' => 'VisualComposer\Modules\Settings\Controller',
	    ...

##Modules descriptions
- All modules should be determine description inside phpDocBlocks on top of Controller


##Module creation:
- Location:
	- ./visualcomposer/Modules/*
	- e.g. ./visualcomposer/Modules/SaveManager/Controller.php
- Implements: __all modules MUST implement \VisualComposer\Framework\Illuminate\Support\Module__ interface
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
	* You are able to use it in `__construct()` by default like: `public function __construct( \VisualComposer\Helpers\Request $request, \VisualComposer\Helpers\Templates $templates )`
	* Using of dependency injection will return same object always
- All helpers and modules can be accessed by `vcapp()` function call:
	* `vcapp()` itself returns VisualComposer\Application instance
	* `vcapp('HelperNameHelper')` returns VisualComposer\Helpers\... singleton instance
	* `vcapp('ModuleName')` return VisualComposer\Modules\... singleton instance
	
- Methods injection also is available simillar like in Laravel : `public function myMethod( \VisualComposer\Helpers\Request $request, \VisualComposer\Helpers\Templates $templates )`
	* Note: That myMethod should be called by `$this->call('methodName', $args=[] );`
	* Note: Methods can be also private

##Events usage:
- All events is provided by `VisualComposer/Framework/Illuminate/Contracts/Dispatcher` class
- Same logic as in Laravel with `$dispatcher->listen()` and `$dispatcher->fire()`

##Resources like views(templates) usage:
- Location: `visualcomposer/resources/views`
- Views path __MUST__ be simillar to the module path ( e.g. visualcomposer/resources/views/saveManager/template.php )
- Template can be rendered by `\VisualComposer\Helpers\Templates` helper:
	* `vcapp('TemplatesHelper')`
	* method/DI injection like: `public function __construct( \VisualComposer\Helpers\Templates $templatesHelper )`
	* e.g: `$templatesHelpers->render( $relativePathToTemplate, $args=[], $doEcho = true)`;
	
##Best practices:
- In templates is better to use `vcapp('...')` shortcut
- In method that is called by public/wordpress actions also better to use `vcapp('..')` shortcut
- All other cases better to use DI or Method injection `private function myMethod( SomeOtherHelperOrModule $object )`
- Good when most of inner methods call was called by `$this->call()` __this will allow to use method injection__
