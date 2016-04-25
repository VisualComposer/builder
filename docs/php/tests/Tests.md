# Tests
- Tests use wp-cli test [api](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)

## Running
- See Running-Local.md
- All tests pushed on server will be run with docker environment

## Guidelines
- System is separated into logical parts -> framework, helpers, modules, resources, plugin(application, bootstrap)
- Before start writing test you should define what logical part it is
- Start test writing by checking is modules or helper instance was created
- Write tests for checking output in public methods
- Try to make tests with maximal coverage ( it is fine when you check flow from start to end )
	* If some function uses X other functions it
	    is better to write tests for functions where X is maximal
	* You should test actions flow (__construct()->otherMethods()->secondMethod())
- Write tests for getters and setters
- Write tests for wp actions and filters ( trigger it in test and check for output )

## Notes for coverage and configuration
- All tests for logical parts should be inside own folder
- Test folder should be listed in configuration xml file [phpunit.xml]
- The logical part what test is testing should be written in whiteling in configuration xml file [phpunit.xml]

## Build
- For success build all tests must be passed
- Any of covered parts must be covered atleast to 50%
