#Tests
- Tests use wp-cli test [api](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)

##Guidelines
- Start test writing by checking is modules or helper instance was created
- Write tests for checking output in public methods
- Try to make tests with maximal coverage ( it is fine when you check flow from start to end )
	* If some function uses X other functions it
	    is better to write tests for functions where X is maximal
	* You should test actions flow (__construct()->otherMethods()->secondMethod())
- Write tests for getters and setters
- Write tests for wp actions and filters ( trigger it in test and check for output )
