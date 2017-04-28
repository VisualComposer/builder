
        'woocommerceMyAccount' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceMyAccount/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceMyAccount/woocommerceMyAccount/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceMyAccount/woocommerceMyAccount/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce My Account',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceMyAccount/woocommerceMyAccount/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceMyAccount/woocommerceMyAccount/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    