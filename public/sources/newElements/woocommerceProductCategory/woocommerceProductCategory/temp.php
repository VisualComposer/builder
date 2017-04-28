
        'woocommerceProductCategory' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategory/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategory/woocommerceProductCategory/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductCategory/woocommerceProductCategory/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Product Category',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceProductCategory/woocommerceProductCategory/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceProductCategory/woocommerceProductCategory/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    