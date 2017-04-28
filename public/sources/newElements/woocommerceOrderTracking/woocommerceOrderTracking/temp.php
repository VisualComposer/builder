
        'woocommerceOrderTracking' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceOrderTracking/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceOrderTracking/woocommerceOrderTracking/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceOrderTracking/woocommerceOrderTracking/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Order Tracking Form',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceOrderTracking/woocommerceOrderTracking/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceOrderTracking/woocommerceOrderTracking/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    