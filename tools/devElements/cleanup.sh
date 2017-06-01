#!/bin/bash

declare -a arr=(
'row'
'column'
'textBlock'
'singleImage'
'basicButton'
'featureSection'
'flickrImage'
'googleFontsHeading'
'googleMaps'
'googlePlusButton'
'heroSection'
'facebookLike',
'feature',
'icon'
'imageGallery'
'imageMasonryGallery'
'instagramImage'
'outlineButton'
'pinterestPinit'
'rawHtml'
'rawJs'
'separator'
'shortcode'
'twitterButton'
'twitterGrid'
'twitterTimeline'
'twitterTweet'
'vimeoPlayer'
'wpWidgetsCustom'
'wpWidgetsDefault'
'youtubePlayer'
'faqToggle')

EXECDIR=`pwd`
for i in "${arr[@]}"
do
   rm -rf $EXECDIR/elements/$i/.git
   rm -f $EXECDIR/elements/$i/package.json
   rm -f $EXECDIR/elements/$i/webpack.config.js
   rm -f $EXECDIR/elements/$i/.gitignore
   rm -f $EXECDIR/elements/$i/public/dist/vendor.bundle.js
   rm -f $EXECDIR/elements/$i/public/dist/.gitkeep
   rm -f $EXECDIR/elements/$i/$i/settings.json
   rm -f $EXECDIR/elements/$i/$i/component.js
   rm -f $EXECDIR/elements/$i/$i/index.js
   rm -f $EXECDIR/elements/$i/$i/styles.css
   rm -f $EXECDIR/elements/$i/$i/editor.css
   rm -rf $EXECDIR/elements/$i/$i/public/src
   rm -rf $EXECDIR/elements/$i/$i/cssMixins
done

echo "Done!"