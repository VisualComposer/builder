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

declare -a projectIds=(
'3328813'
'3328811'
'3328809'
'3328801'
'3328799'
'3328797'
'3328791'
'3328789'
'3328787'
'3328784'
'3328782'
'3328778'
'3328772'
'3328770'
'3328764'
'3328760'
'3328758'
'3328754'
'3328749'
'3328744'
'3328740'
'3328738'
'3328733'
'3328732'
'3328728'
)
EXECDIR=`pwd`
for i in "${projectIds[@]}"
do
	# curl --header "PRIVATE-TOKEN: " -X POST "https://gitlab.com/api/v3/projects?name=$i&namespace_id=1529834"
	#curl --header "PRIVATE-TOKEN: " -X POST "https://gitlab.com/api/v4/projects/$i/deploy_keys/673905/enable"

   #cd /Users/Konutis/Sites/vcelements
   #echo "Cloning element $i from git@gitlab.com:visualcomposer-hub/$i.git"
   #git clone git@gitlab.com:visualcomposer-hub/$i.git $EXECDIR/devElements/$i
   #echo "Copying element $i to /Users/Konutis/Sites/vcelements/$i"



   #cp -r $EXECDIR/public/sources/newElements/$i/ $EXECDIR/devElements/$i
   #cp ./.gitignore /Users/Konutis/Sites/vcelements/$i/.gitignore
   #cp ./package.json /Users/Konutis/Sites/vcelements/$i/package.json

   #cd /Users/Konutis/Sites/vcelements/$i && git add . && git commit -m "Initial element commit $i #341404808166592"
   #cd /Users/Konutis/Sites/vcelements/$i && git push

   # in case of remove
   #cd /Users/Konutis/Sites/vcelements/$i && rm -rf $i



   #cp $EXECDIR/tools/devElements/webpack.config.js $EXECDIR/devElements/$i/webpack.config.js
   #cp $EXECDIR/tools/devElements/package.json $EXECDIR/devElements/$i/package.json
   #sed -i "s:\[element\]:$i:g" $EXECDIR/devElements/$i/webpack.config.js
   #cd $EXECDIR/devElements/$i && git add . && git commit -m "Initial element $i commit" && git push
done

#git clone git@gitlab.com:visualcomposer-hub/featureSection.git

echo "Done!"