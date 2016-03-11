#Helpers
Generic and WordPress helpers located in ./visualcomposer/Helpers

##Helpers usage
- `vcapp('templateHelper')`, `vcapp('requestHelper')` - by vcapp() function call
- `public function myMethod( \VisualComposer\Helpers\Generic\Url $urlHelper,
    \VisualComposer\Helpers\WordPress\Nonce $nonceHelper)` - by Method dependency injection

##Helpers information
- Generic:
	- `\VisualComposer\Helpers\Generic\Core` - helpers for plugin core
	- `\VisualComposer\Helpers\Generic\Templates` - helper to render template
	- `\VisualComposer\Helpers\Generic\Data` - helper to process given $data (e.g. arraySearch)
	- `\VisualComposer\Helpers\Generic\Request` - helper to get `$_GET, $_POST, $_REQUEST` data
	    by `->input()` and `->exists()` methods
	- `\VisualComposer\Helpers\Generic\Url` - helper to get url for assets or plugin URL
- WordPress:
	- `\VisualComposer\Helpers\WordPress\File` - helper to get/set file contents [@todo improve]
	- `\VisualComposer\Helpers\WordPress\Nonce` - helper to create/check admin/user Nonces
	- `\VisualComposer\Helpers\WordPress\Options` - helper to get/set wp option (get_option,update_option)
	
##New helper creation
- Location: `visualcomposer/Helpers/*`
- Naming:
	- prefer to use CamelCase for any Helper or Module
	- put Generic helper into visualcomposer/Helpers/Generic folder
	- put Modules helpers into visualcomposer/Helpers/Modules folder
- Registration:
	- Add helperName=>helperNameSpace/Class into `./visualcomposer/Application.php` $helpers variable

##Tips and Notes
- Helpers can also extend `\VisualComposer\Framework\Container` - this will allow to use Dependency/Method Injection
    and $this->call() function
- Helpers by default is shared(single instance), but you can also create them manualy. (__avoid this for performance__)