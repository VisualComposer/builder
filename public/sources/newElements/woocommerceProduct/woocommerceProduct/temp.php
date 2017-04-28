
        'woocommerceProduct' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProduct/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProduct/woocommerceProduct/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProduct/woocommerceProduct/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Product',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceProduct/woocommerceProduct/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceProduct/woocommerceProduct/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    