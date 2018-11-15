#!/bin/bash

echo "My script is running."

declare -a arr=(
'themeEditor'
'globalTemplate'
'exportImport'
'wpbMigration'
'templateWidget'
)

EXECDIR=`pwd`

for i in "${arr[@]}"
do
   if cd $EXECDIR/devAddons/$i; then cd $EXECDIR/devAddons/$i && git pull; else git clone git@gitlab.com:visualcomposer-hub/addons/$i.git $EXECDIR/devAddons/$i; fi
done

echo "Done!"