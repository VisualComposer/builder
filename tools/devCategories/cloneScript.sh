#!/bin/bash

echo "My script is running."

EXECDIR=`pwd`

if cd $EXECDIR/devCategories/categories; then cd $EXECDIR/devCategories/categories && git pull; else git clone git@gitlab.com:visualcomposer-hub/data/categories.git $EXECDIR/devCategories/categories; fi

echo "Done!"