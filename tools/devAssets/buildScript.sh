#!/bin/bash

echo "### Build Script v1.0"

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#!/bin/bash

find $EXECDIR/public/sources/assetsLibrary/ -maxdepth 1 -type d | tail -n +2 | xargs -I % sh -c 'cd % && npx webpack --config=webpack.config.babel.js -p'
