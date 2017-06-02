# Visual Composer Website Builder

[![build status](https://gitlab.com/visual-composer-website-builder/builder/badges/master/build.svg)](https://gitlab.com/visual-composer-website-builder/builder/commits/master)
[![coverage report](https://gitlab.com/visual-composer-website-builder/builder/badges/master/coverage.svg)](https://gitlab.com/visual-composer-website-builder/builder/commits/master)


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
$ npm install
$ npm install standard -g
$ npm install -g eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise  eslint-config-standard-react eslint-config-standard-jsx eslint-plugin-react
```
### Environment Configuration in Javascript
If you want to setup custom environment configuration settings,3 you can use *custom-variables.js* by c it from default-variables.js.

### Feature toggle and environment Configuration in Javascript
To build a deliverable product use feature toggle to enable/disable some code features and fixes. Default state of feature toggle is set in *default-variables.js*. 
You can customize settings by creating copy of variables file *default-variables.js* with a git ignored filename *custom-variables.js*. 

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
### Build project
```sh
$ npm run build
```
### Start watcher
```sh
$ npm run watch
```

###  Add dev elements for macOs users ###
```sh
bash tools/devElements/cloneScript.sh
bash tools/devElements/buildScriptWindows.sh
```

###  Add dev elements for Windows users ###
```sh
bash tools/devElements/cloneScript.sh
bash tools/devElements/buildScriptMac.sh
```

## Build Wordpress plugin package(zip archive)
```sh
node tools/vcwb-builder/builder plugin -p <directoryWhereToPlaceZipArchive>
node tools/vcwb-builder/builder plugin --help # for more info
```
