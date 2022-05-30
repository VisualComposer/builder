# Contributing to Visual Composer Website Builder
You can contribute and help make Visual Composer better. Follow the guidelines:
 - [Code of Conduct](#code-of-conduct)
 - [Submission Guidelines](#submission-guidelines)
 - [Coding Rules](#coding-rules)
 - [Installation instruction](#installation-instruction)

## Code of Conduct
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Submission Guidelines

### Forking workflow
Keep the `master` branch tests passing at all times.

If you send a pull request, please do it against the master branch. We maintain stable branches for major versions separately (Example: `12.x`). Instead of accepting pull requests to the version branches directly, we cherry-pick non-breaking changes from `master` to the version.

Make fork for of VCWB repo in GitHub. Go to your active WordPress `wp-content/plugins` directory.

```sh
$ git clone git@github.com:<Username>/builder.git visualcomposer
$ cd visualcomposer
$ git remote add upstream git@github.com:VisualComposer/builder.git
$ git remote set-url --push upstream no_push
$ git remote -v
origin	git@github.com:<Username>/builder.git (fetch)
origin	git@github.com:<Username>/builder.git (push)
upstream	git@github.com:VisualComposer/builder.git (fetch)
upstream	no_push (push)
```

### Creating features
Use [Feature Branch workflow](https://es.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). If you want to send you data to upstream you need to [create pull request in GitHub](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork).

```sh
$ git checkout -b <VC-ID-feature-branch-in-kebab-case>
# Edit some code
$ git commit -m "[VC-ID] Message for change"
$ git push -u origin <VC-ID-feature-branch-in-kebab-case>
```

### Bring builder up to date
```sh
$ git checkout master && git pull upstream master # checkout
$ git push
```

### Cleanup after pull request
```sh
$ git branch -d <branch name>
$ git push origin master
```

## Coding Rules

### Javascript Code Style
Use Eslint to validate code-style `yarn lint`.

#### Variables and Classes
For all var, let, const and method names you should use camelCase.

Exceptions to the rule:
* Class names for ES6 with camelCase and first Uppercase letter.
* Constructors for ES5 with camelCase and first Uppercase letter.

#### No jQuery
Contributor should try not to use jQuery and jQuery-like libraries.

### PHP Code Style
We use PSR-2 Code style and CodeSniffer is configured in ruleset.xml to check PSR2 rules.
[http://www.php-fig.org/psr/psr-2/]

- You MUST use short array syntax ```[]```
- You MUST never use php short open tag, even for ```<?=$something ?>```, use ```<?php echo $something; ?>```
- Any statement MUST end with semicolon; even if it is single line method like ```<?php echo $something; ?>```
- Spaces within brackets ONLY if key is variable or expression like ```$data[ $test ]```
- Use spaces not tabs `PSR1`.
- Use `phpcs` command to check for codeStyle issues in PHP files.
- `php ci/phpcs.phar --standard=ci/ruleset.xml visualcomposer`

#### Differences between Helpers and Modules
- Helpers and Modules by default are __singletons__ [for performance]
- Helpers doesn't have logic for action listeners (like WordPress actions/filters)
- Helpers doesn't have events listeners
- This is the reason Why `Access`, `CurrentUserAccess` and `RoleAccess` was Helpers
- Helpers contains only API for processing some data or retreive some result
- Helpers are __PUBLIC__, this means it __SHOULD__ be used by other theme/plugins developers
- Helpers are __NOT__ automaticaly instatiated, but Modules does
- Module can have own helper to process Public API
- Module __SHOULD__ be __PROTECTED__ access, this means other theme/plugins developers __SHOULD NOT__ not use modules
   as API, instead they __SHOULD__ use Modules __PUBLIC__ Api in
    `\VisualComposer\Helpers\HelperName..`

## Installation instruction
All javascript is build with webpack module builder. Install the plugin and checked that it works, you can make changes to it to get acquainted with the code.

### Requirements
* PHP >= 5.6.0 (PHP 7+ is recommended)
* WordPress >= 5.0.0
* PHP `gd2/imagick`, `php-curl`, `php-zip` and ` php-exif` extensions to be loaded
* Node >= 10.16.0
* npm >= 6.9.0
* yarn >= 1.17.3

Locate plugin folder in your WordPress installation under `wp-content/plugins` and clone builder repo here.

##### 1. Install node modules and php composer dependencies
``` sh
$ yarn install
$ php ci/composer.phar update
```

##### 2. Build project
```sh
$ yarn build
# watch
$ yarn watch
```
##### 3. Build elements
```sh
$ bash tools/elements/buildScript.sh
# or production version
$ bash tools/elements/buildProductionScript.sh
```
You can build each element separately.
```sh
$ cd elements/{elementDirectory}
$ ../../node_modules/.bin/webpack --config=../../node_modules/vc-webpack-vendors/webpack.config.js
# watch
$ ../../node_modules/.bin/webpack --config=../../node_modules/vc-webpack-vendors/webpack.config.js --watch
```
Compile less files in elements
```sh
$ lessc {source/path} {output/path} --autoprefix="last 2 versions"
```
Build public assets for element if exist.
```sh
$ cd elements/{elementDirectory}/{elementDirectory}/public
# build
$ ../../../../node_modules/.bin/webpack --config=webpack.config.js -p
# watch
$ ../../../../node_modules/.bin/webpack --config=webpack.config.js -p --watch
```

#### Build assets
```sh
$ cd public/sources/assetsLibrary/{assetDirectory}
$ ../../../../node_modules/.bin/webpack --config=webpack.config.babel.js -p
```

#### Updating icon libraries
To update the icon set:
1. Update iconpicker asset
Each icon set library has its own folder under `public/sources/assetsLibrary/iconpicker/src`.
Follow these steps to update the asset:
- appropriate files needs to be updated in `fonts` and `less` folders
- the **iconpicker** asset should be build as per **Build assets**
- the `dist/fonts` folder should be populated with the updated font as well
- update the name of the iconset folder if necessary
- inside `webpack.config.babel.js` file update the path to the iconset folder if needed

2. Update attribute
*iconpicker* attribute is located under the `public/sources/attributes/iconpicker`.
Each icon set library has its own JavaScript file that exports an object with settings.
- generate an updated object
- replace newly generated object
- update filename if necessary
- inside `Component.js` file update path to file if needed

To generate an object with settings for the Font Awesome library:

- you need an `icons.json` file and an `categories.yml` which you need to convert to `.json` format
- copy each file contents and in browser console assign each to its own variable `icons` and `categories` accordingly
- then run the script provided below
- copy and paste the resulting object into the file

Script to generate Font Awesome settings object:

```
var newCategories = {}

Object.keys(categories).forEach((category) => {
  newCategories[categories[category].label] = []
  categories[category].icons.forEach((icon) => {
    icons[icon].styles.forEach((style) => {
      var iconId = ''
      if (style === "solid") {
        iconId = "fas"
      }
      if (style === "regular") {
        iconId = "far"
      }
      if (style === "brands") {
        iconId = "fab"
      }
      var iconData = {
        title: icons[icon].label,
        id: iconId + ' fa-' + icon
      }
      newCategories[categories[category].label].push(iconData)
    })
  })
})
JSON.stringify(newCategories)
```
**NOTE**: depending on the version and structure of the Font Awesome library some changes might be necessary.


##### Install local githooks
Git hooks will add pre-commit hooks to keep commits clean.
```sh
$ cd _infrastructure
$ ./install-hooks
```

##### Debug mode
You can enable debug mode by adding `env-dev.php` file to the root directory of the project.
```php
<?php

if (!VcvEnv::has('VCV_DEBUG')) {
    VcvEnv::set('VCV_DEBUG', true);
}
require_once "env.php";
```


