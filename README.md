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

###  Add dev elements/categories/addons ###
```sh
bash tools/devElements/cloneScript.sh
bash tools/devCategories/cloneScript.sh
bash tools/devAddons/cloneScript.sh
bash tools/devElements/buildScript.sh
bash tools/devAddons/buildScript.sh
```

### env-dev.php example
```php
<?php


if (!VcvEnv::has('VCV_DEBUG')) {
    VcvEnv::set('VCV_DEBUG', true);
}
//DEV
VcvEnv::set('VCV_ENV_DEV_ADDONS', true);
VcvEnv::set('VCV_ENV_DEV_ELEMENTS', true);
VcvEnv::set('VCV_ENV_DEV_CATEGORIES', true);

VcvEnv::set('VCV_ENV_EXTENSION_DOWNLOAD', true);

VcvEnv::set('VCV_ENV_FT_GLOBAL_CSS_JS_SETTINGS', true);
VcvEnv::set('VCV_ENV_FT_SYSTEM_CHECK_LIST', true);

if (!VcvEnv::has('VCV_LICENSE_ACTIVATE_URL')) {
    VcvEnv::set('VCV_LICENSE_ACTIVATE_URL', 'https://test.account.visualcomposer.io/activation');
}
if (!VcvEnv::has('VCV_LICENSE_ACTIVATE_FINISH_URL')) {
    VcvEnv::set('VCV_LICENSE_ACTIVATE_FINISH_URL', 'https://test.account.visualcomposer.io/finish-license-activation');
}
if (!VcvEnv::has('VCV_LICENSE_DEACTIVATE_FINISH_URL')) {
    VcvEnv::set(
        'VCV_LICENSE_DEACTIVATE_FINISH_URL',
        'https://test.account.visualcomposer.io/finish-license-deactivation'
    );
}
if (!VcvEnv::has('VCV_LICENSE_DEACTIVATE_URL')) {
    VcvEnv::set('VCV_LICENSE_DEACTIVATE_URL', 'https://test.account.visualcomposer.io/deactivate-license');
}
if (!VcvEnv::has('VCV_API_URL')) {
    VcvEnv::set('VCV_API_URL', 'https://test.account.visualcomposer.io');
}
if (!VcvEnv::has('VCV_TOKEN_URL')) {
    VcvEnv::set('VCV_TOKEN_URL', 'https://test.account.visualcomposer.io/authorization-token');
}
if (!VcvEnv::has('VCV_PREMIUM_TOKEN_URL')) {
    VcvEnv::set('VCV_PREMIUM_TOKEN_URL', 'https://test.account.visualcomposer.io/authorization-token');
}
if (!VcvEnv::has('VCV_HUB_URL')) {
    VcvEnv::set('VCV_HUB_URL', 'https://test.account.visualcomposer.io');
}

require_once "env.php";
```

## Build Wordpress plugin package (zip archive)
```sh
git clone account-project
node [account-project]_infrastructure/vcwb-builder/builder plugin2 -p <directoryWhereToPlaceZipArchive>
node [account-project]_infrastructure/vcwb-builder/builder plugin2 --help # for more info
```
