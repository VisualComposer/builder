#Helpers
Helpers located in ./visualcomposer/Helpers

##Helpers usage
- `vchelper('Templates')`, `vchelper('Request')` - by vchelper() function call
- `public function myMethod( \VisualComposer\Helpers\Url $urlHelper,
    \VisualComposer\Helpers\Nonce $nonceHelper)` - by Method dependency injection

##Helpers information
- `\VisualComposer\Helpers\Core` - helpers for plugin core
- `\VisualComposer\Helpers\Templates` - helper to render template
- `\VisualComposer\Helpers\Data` - helper to process given $data (e.g. arraySearch)
- `\VisualComposer\Helpers\Request` - helper to get `$_GET, $_POST, $_REQUEST` data
    by `->input()` and `->exists()` methods
- `\VisualComposer\Helpers\Url` - helper to get url for assets or plugin URL
- `\VisualComposer\Helpers\File` - helper to get/set file contents [@todo improve]
- `\VisualComposer\Helpers\Nonce` - helper to create/check admin/user Nonces
- `\VisualComposer\Helpers\Options` - helper to get/set wp option (get_option,update_option)
	
##New helper creation
- Location: `visualcomposer/Helpers/*`
- Implements: __ALL helpers MUST implement \VisualComposer\Framework\Illumiate\Support\Helper__ interface
- Naming:
	- prefer to use CamelCase for any Helper or Module
- Registration:
	- Add helperName=>helperNameSpace/Class into `./visualcomposer/Application.php` $helpers variable

##Tips and Notes
- Helpers can also extend `\VisualComposer\Framework\Container` - this will allow to use Dependency/Method Injection
    and $this->call() function
- Helpers by default is shared(single instance), but you can also create them manualy. (__avoid this for performance__)