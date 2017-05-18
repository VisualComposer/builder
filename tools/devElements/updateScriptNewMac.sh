#!/bin/bash

echo "My script is running."

declare -a arr=(
'animatedOulineButton'
'doubleOutlineButton'
'gradientButton'
'postsGrid'
'postsGridDataSourceCustomPostType'
'postsGridDataSourcePage'
'postsGridDataSourcePost'
'postsGridItemPostDescription'
'woocommerceAddToCart'
'woocommerceBestSellingProducts'
'woocommerceCart'
'woocommerceCheckout'
'woocommerceFeaturedProducts'
'woocommerceMyAccount'
'woocommerceOrderTracking'
'woocommerceProduct'
'woocommerceProductAttribute'
'woocommerceProductCategories'
'woocommerceProductCategory'
'woocommerceProductPage'
'woocommerceProducts'
'woocommerceRecentProducts'
'woocommerceRelatedProducts'
'woocommerceSaleProducts'
'woocommerceTopRatedProducts'
)


#'row'
#'column'
#'textBlock'
#'singleImage'
#'basicButton'
#'featureSection'
#'flickrImage'
#'googleFontsHeading'
#'googleMaps'
#'googlePlusButton'
#'heroSection'
#'icon'
#'imageGallery'
#'imageMasonryGallery'
#'instagramImage'
#'outlineButton'
#'pinterestPinit'
#'rawHtml'
#'rawJs'
#'separator'
#'facebookLike',
#'feature',
#'shortcode'
#'twitterButton'
#'twitterGrid'
#'twitterTimeline'
#'twitterTweet'
#'vimeoPlayer'
#'wpWidgetsCustom'
#'wpWidgetsDefault'
#'youtubePlayer'

EXECDIR=`pwd`
for i in "${arr[@]}"
do
   #cd /Users/Konutis/Sites/vcelements
   #echo "Cloning element $i from git@gitlab.com:visualcomposer-hub/$i.git"
   #git clone git@gitlab.com:visualcomposer-hub/$i.git $EXECDIR/devElements/$i
   #echo "Copying element $i to /Users/Konutis/Sites/vcelements/$i"
   #cp -r $EXECDIR/public/sources/newElements/$i/ $EXECDIR/devElements/$i
   #cp $EXECDIR/tools/devElements/.gitignore $EXECDIR/devElements/$i/.gitignore
   #cp $EXECDIR/tools/devElements/package.json $EXECDIR/devElements/$i/package.json

   #cd /Users/Konutis/Sites/vcelements/$i && git add . && git commit -m "Initial element commit $i #341404808166592"
   # cd /Users/Konutis/Sites/vcelements/$i && git push

   # in case of remove
   #cd /Users/Konutis/Sites/vcelements/$i && rm -rf $i


   #cp $EXECDIR/tools/devElements/.gitignore $EXECDIR/devElements/$i/.gitignore
   #cp $EXECDIR/tools/devElements/webpack.config.js $EXECDIR/devElements/$i/webpack.config.js
   #cp $EXECDIR/tools/devElements/package.json $EXECDIR/devElements/$i/package.json
   sed -i "" "s:\[element\]:$i:g" $EXECDIR/devElements/$i/webpack.config.js
   cd $EXECDIR/devElements/$i && git add . && git commit -m "Update webpack for element $i" && git push
done

#git clone git@gitlab.com:visualcomposer-hub/featureSection.git

echo "Done!"