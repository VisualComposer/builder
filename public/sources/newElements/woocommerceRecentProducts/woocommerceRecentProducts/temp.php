
        'woocommerceRecentProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRecentProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRecentProducts/woocommerceRecentProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRecentProducts/woocommerceRecentProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Recent Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceRecentProducts/woocommerceRecentProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceRecentProducts/woocommerceRecentProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    