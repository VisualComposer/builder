#!/bin/bash

echo "My script is running."

declare -a arr=(
'themeEditor'
'globalTemplate'
'exportImport'
'templateWidget'
)

EXECDIR=`pwd`

for i in "${arr[@]}"
do
   if cd $EXECDIR/devAddons/$i; then cd $EXECDIR/devAddons/$i && git status; fi
done

echo "Done!"