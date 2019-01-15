#!/bin/bash

echo "Clean script is running."
EXECDIR=`pwd`

rm -rf $EXECDIR/elements/wpbakeryElement;
rm -rf $EXECDIR/elements/wpbakeryElementContainer;
rm -rf $EXECDIR/devAddons/wpbMigration;
rm -rf $EXECDIR/devElements/row;
rm -rf $EXECDIR/devElements/column;
rm -rf $EXECDIR/devElements/textBlock;
rm -rf $EXECDIR/devElements/singleImage;
rm -rf $EXECDIR/devElements/basicButton;
rm -rf $EXECDIR/devElements/googleFontsHeading;
rm -rf $EXECDIR/devElements/youtubePlayer;
rm -rf $EXECDIR/devElements/vimeoPlayer;
rm -rf $EXECDIR/devElements/separator;
rm -rf $EXECDIR/devElements/wpWidgetsCustom;
rm -rf $EXECDIR/devElements/wpWidgetsDefault;
rm -rf $EXECDIR/devElements/shortcode;
rm -rf $EXECDIR/devElements/outlineButton;

echo "Done!"
