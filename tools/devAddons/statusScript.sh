#!/bin/bash

echo "My script is running."

EXECDIR=`pwd`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
declare -a arr=($(cat "$DIR/addons.list"))

for i in "${arr[@]}"
do
   if cd $EXECDIR/devAddons/$i; then cd $EXECDIR/devAddons/$i && git status; fi
done

echo "Done!"