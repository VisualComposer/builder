# Visual Composer 5.0 (Сurry)

[![build status](https://ci.visualcomposer.io/vcb/vcb/badges/master/build.svg)](https://ci.visualcomposer.io/vcb/vcb/commits/master)

## Javascript Code Style
All javascript is build with webpack module bundler.

Use standardJS to validate CC.
When you create file with jsx content at first line of file add:
```
/*eslint jsx-quotes: ["error", "prefer-double"]*/
```
### Supported Language
Use ES6 version for Javascript code.

### Variables and Classes
For all var,let,const and method names you should use camelCase. 
Exceptions to the rule:
    * Class names for ES6 with camelCase and first Uppercase letter. Example: MySuperClass
    * Constructors for ES5 with camelCase and first Uppercase letter. Example: var Constructor = function(){}

### No jQuery
Contributor should try not to use jQuery and jQuery-like libraries.

### Installation instruction
``` sh
$ npm install standard -g
$ npm install -g eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise  eslint-config-standard-react eslint-config-standard-jsx eslint-plugin-react
```


## Javascript demo editor
This is standalone editor via node server with webpack dev-server support.


### Install dependencies
```sh
# npm install webpack -g
# npm install webpack-dev-server -g
$ npm install
```

### Install local githooks
```sh
$ cd _infrastructure
$ ./install-hooks
```

### Start watcher
```sh
$ webpack && webpack --progress --colors --watch
```

### Start Demo server
```sh
$ webpack-dev-server --content-base public/
```
### Start Debug demo server

```sh
$ npm start
```

URL in your browser: http://localhost:3000/webpack-dev-server/index.html


load:navbar,add-element,edit-element,
load:

### Compile element ###
```sh
node tools/element-builder/index.js --uuid=elementTag --output=file path/to/element/
```