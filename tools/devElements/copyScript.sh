#!/bin/bash

echo "My script is running."

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/elements.list"))

for i in "${arr[@]}";
do {
  i=${i//[$'\t\r\n']}
  echo $EXECDIR/devElements/$i
  if cd $EXECDIR/devElements/$i; then
    #cp $DIR/copy/.gitlab-ci.yml $EXECDIR/devElements/$i/.gitlab-ci.yml
    #sed -i "s/REPLACE_ME/$i/g" $EXECDIR/devElements/$i/.gitlab-ci.yml
    #cp $DIR/copy/.gitignore $EXECDIR/devElements/$i/.gitignore
    #cp $DIR/copy/package.json $EXECDIR/devElements/$i/package.json
    #rm -rf $EXECDIR/devElements/$i/node_modules/
    #rm -rf $EXECDIR/devElements/$i/package-lock.json
    #rm -rf $EXECDIR/devElements/$i/yarn.lock
    #ln -s $DIR/copy/node_modules $EXECDIR/devElements/$i/node_modules
    #cp $DIR/copy/yarn.lock $EXECDIR/devElements/$i/yarn.lock
    #cp $DIR/copy/webpack.element.plugin.babel.js $EXECDIR/devElements/$i/webpack.element.plugin.babel.js
    #cd $EXECDIR/devElements/$i
    #yarn install
    #yarn build
    #cd $EXECDIR/devElements/$i
    #yarn standard
    echo "DO NOTHING"
  fi

} done


echo "Done!"
