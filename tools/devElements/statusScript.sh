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
'facebookLike'
'feature'
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
'faqToggle'
'postsGridItemPostDescription'
'postsGridDataSourcePost'
'postsGridDataSourcePage'
'postsGridDataSourceCustomPostType'
'postsGridDataSourceListOfIds'
'postsGrid'
'woocommerceTopRatedProducts'
'woocommerceSaleProducts'
'woocommerceRelatedProducts'
'woocommerceRecentProducts'
'woocommerceProducts'
'woocommerceProductPage'
'woocommerceProductCategory'
'woocommerceProductCategories'
'woocommerceProductAttribute'
'woocommerceProduct'
'woocommerceOrderTracking'
'woocommerceMyAccount'
'woocommerceFeaturedProducts'
'woocommerceCheckout'
'woocommerceCart'
'woocommerceBestSellingProducts'
'woocommerceAddToCart'
)

EXECDIR=`pwd`
for i in "${arr[@]}"
do
   echo $i && cd $EXECDIR/devElements/$i && git status
   #cd /Users/Konutis/Sites/vcelements
   #echo "Cloning element $i from git@gitlab.com:visualcomposer-hub/$i.git"
   #git clone git@gitlab.com:visualcomposer-hub/$i.git
   #echo "Copying element $i to /Users/Konutis/Sites/vcelements/$i"
   #cp -r /Users/Konutis/Sites/vc-five/public/sources/newElements/$i/ /Users/Konutis/Sites/vcelements/$i
   #cp ./.gitignore /Users/Konutis/Sites/vcelements/$i/.gitignore
   #cp ./package.json /Users/Konutis/Sites/vcelements/$i/package.json
   
   #cd /Users/Konutis/Sites/vcelements/$i && git add . && git commit -m "Initial element commit $i #341404808166592"
   #cd /Users/Konutis/Sites/vcelements/$i && git push
   
   # in case of remove
   #cd /Users/Konutis/Sites/vcelements/$i && rm -rf $i
done

#git clone git@gitlab.com:visualcomposer-hub/featureSection.git

echo "Done!"