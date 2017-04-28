
        'woocommerceCart' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCart/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCart/woocommerceCart/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCart/woocommerceCart/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Cart',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceCart/woocommerceCart/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceCart/woocommerceCart/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    