# Coding style

## Js/Node
VC5 code style based on node code style: http://nodeguide.com/style.html

- 2 space indention
- Use semicolons
- Clean up any trailing whitespace in your JavaScript files
- Limit your lines to 80 characters
- Use single quotes, unless you are writing JSON
- Your opening braces go on the same line as the statement 
- Declare one variable per var statement
- Variables and properties should use lower camel case capitalization
- Class names should be capitalized using upper camel case
- Use the triple equality operator


Project in JS consists of *modules* and *services*.
- **Module** is encapsulated peace of data that can access to own code and only
- **Service** is object that can be accessed by modules via vc-cake object method. getService
Service should have very pure logic and it never works with DOM elements(if browser is used)

- vc-cake.js is a base library to build js:  https://npmjs.com/package/vc-cake
- Project is bundled with webpack

Main file example

```javascript
var VcCake = require('vc-cake');
var path = require('path');

VcCake
  .require(path.join(__dirname, 'modules/Editor'))
  .addService('utils', path.join(__dirname, 'services/Utils'))
  .init();

```

##PHP
We use PSR-2 Code style and codesniffer is configured in ruleset.xml to check PSR2 rules
http://www.php-fig.org/psr/psr-2/

Side notes:
- You MUST use short array syntax ```[]```
- You MUST never use php short open tag, even for ```<?=$something ?>```, use ```<?php echo $something; ?>```
- Any statement MUST end with semicolon; even if it is single line method like ```<?php echo $something; ?>```
- Spaces within brackets ONLY if key is variable or expression like ```$data[ $test ]```
- Use spaces not tabs [PSR1]

##Less/Css

