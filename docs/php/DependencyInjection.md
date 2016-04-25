#Dependency and Method injection
Application `vcapp()->call($callback)` and any class that extends `\VisualComposer\Framework\Container` are able to use 
	`$this->call()` which will trigger your provided `$callback` and inject their dependencies and merge with given 
	params
	
##Usage
- In Modules/Helpers we use `\VisualComposer\Framework\Container` class to implement injection

## Examples
- See our tests in `/tests/framework/test-di.php`(vcapp()->call tests) and 
	`/tests/framework/test-di-module-container.php`($this->call() test) [__this methods will work with same logic__] 
- Simple injection

	    $func = function (
	        $param1,
	        $param2 = [],
	        \VisualComposer\Helpers\Templates $templates
	    ) {
	        $this->assertEquals('params one', $param1);
	        $this->assertEquals(['my second param'], $param2);
	        $this->assertTrue(is_object($templates));
	    };
	    
	    vcapp()->call($func, [
	        'params one',
	        ['my second param'],
	    ]);
- No difference where injection object is written

	    $func = function (
	        \VisualComposer\Helpers\Templates $templates,
	        $param1,
	        $param2 = []
	    ) {
	        $this->assertEquals('params one', $param1);
	        $this->assertEquals(['my second param'], $param2);
	        $this->assertTrue(is_object($templates));
	    };
	    
	    vcapp()->call($func, [
	        'params one',
	        ['my second param'],
	    ]);
- No difference where injection object is written even if it is in the middle

	    $func = function (
	        $param1,
	        \VisualComposer\Helpers\Templates $templates,
	        $param2 = []
	    ) {
	        $this->assertEquals('params one', $param1);
	        $this->assertEquals(['my second param'], $param2);
	        $this->assertTrue(is_object($templates));
	    };
	    
	    vcapp()->call($func, [
	        'params one',
	        ['my second param'],
	    ]);
- You should only follow sequence of arguments
- But you also use __ASSOCIATIVE__ array to pass arguments:

	    $func = function (
	        $param1,
	        $param2 = [],
	        \VisualComposer\Helpers\Templates $templates
	    ) {
	        $this->assertEquals('params one', $param1);
	        $this->assertEquals(['my second param'], $param2);
	        $this->assertTrue(is_object($templates));
	    };
	    
	    vcapp()->call($func, [
	        'param2' => ['my second param'],
	        'param1' => 'params one',
	    ]);
	    