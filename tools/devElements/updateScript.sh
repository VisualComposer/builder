#!/bin/bash

echo "My script is running."

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
'icon'
'imageGallery'
'imageMasonryGallery'
'instagramImage'
'outlineButton'
'pinterestPinit'
'rawHtml'
'rawJs'
'separator'
'facebookLike'
'feature'
'shortcode'
'twitterButton'
'twitterGrid'
'twitterTimeline'
'twitterTweet'
'vimeoPlayer'
'wpWidgetsCustom'
'wpWidgetsDefault'
'youtubePlayer')

EXECDIR=`pwd`
for i in "${arr[@]}"
do
   cp $EXECDIR/tools/devElements/webpack.config.js $EXECDIR/devElements/$i/webpack.config.js
   sed -i "s:\[element\]:$i:g" $EXECDIR/devElements/$i/webpack.config.js
   cd $EXECDIR/devElements/$i && git add . && git commit -m "update webpack config for $i" && git push
done

#git clone git@gitlab.com:visualcomposer-hub/featureSection.git

echo "Done!"