
        'woocommerceProductCategories' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategories/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategories/woocommerceProductCategories/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategories/woocommerceProductCategories/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Product Categories',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceProductCategories/woocommerceProductCategories/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceProductCategories/woocommerceProductCategories/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    