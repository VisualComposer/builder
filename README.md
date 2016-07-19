# Visual Composer 5.0 (Сurry)

## Javascript Code Style

Use standardJS to validate CC.
When you create file with jsx content at first line of file add:
```
/*eslint jsx-quotes: ["error", "prefer-double"]*/
```

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