# Visual Composer Website Builder

[![build status](https://gitlab.com/visual-composer-website-builder/builder/badges/master/build.svg)](https://gitlab.com/visual-composer-website-builder/builder/commits/master)
[![coverage report](https://gitlab.com/visual-composer-website-builder/builder/badges/master/coverage.svg)](https://gitlab.com/visual-composer-website-builder/builder/commits/master)


## Javascript Code Style
* Use StandardJS to validate code-style `yarn standard`.

## Supported Language
Use ES6 version for Javascript code. https://standardjs.com

## Variables and Classes
For all var, let, const and method names you should use camelCase.
Exceptions to the rule:
* Class names for ES6 with camelCase and first Uppercase letter.
* Constructors for ES5 with camelCase and first Uppercase letter.

## No jQuery
Contributor should try not to use jQuery and jQuery-like libraries.

## Requirements
* PHP > 5.4
* WordPress > 4.6
* PHP `gd2/imagick` extension to be loaded
* Node
* npm
* `npm install -g yarn`

## Installation instruction
All javascript is build with webpack module builder.

``` sh
$ yarn install
$ php ci/composer.phar update
```
### Environment Configuration in Javascript
If you want to setup custom environment configuration settings,3 you can use *custom-variables.js* by c it from default-variables.js.

### Feature toggle and environment Configuration in Javascript
To build a deliverable product use feature toggle to enable/disable some code features and fixes. Default state of feature toggle is set in *default-variables.js*. 
You can customize settings by creating copy of variables file *default-variables.js* with a git ignored filename *custom-variables.js*.

### Install local githooks
```sh
$ cd _infrastructure
$ ./install-hooks
```
### Build project
```sh
$ yarn build
```
### Build settings (Welcome page, Activation page)
```sh
$ yarn build-settings
```
### Start watcher
```sh
$ yarn watch
```

###  Add elements ###
```sh
$ bash tools/elements/buildScript.sh
## or production version
$ bash tools/elements/buildProductionScript.sh
```

### env-dev.php example
```php
<?php

if (!VcvEnv::has('VCV_DEBUG')) {
    VcvEnv::set('VCV_DEBUG', true);
}
require_once "env.php";
```

## Build Wordpress plugin package (zip archive)
```sh
git clone account-project
node [account-project]_infrastructure/vcwb-builder/builder plugin -p <directoryWhereToPlaceZipArchive>
node [account-project]_infrastructure/vcwb-builder/builder plugin --help # for more info
```
