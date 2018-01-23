#!/bin/bash

echo "My script is running."

declare -a arr=(
'themeEditor'
)

EXECDIR=`pwd`

for i in "${arr[@]}"
do
   if cd $EXECDIR/devExtensions/$i; then cd $EXECDIR/devExtensions/$i && git pull; else git clone git@gitlab.com:visualcomposer-hub/addons/$i.git $EXECDIR/devExtensions/$i; fi
done

echo "Done!"