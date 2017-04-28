
        'woocommerceProductPage' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductPage/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductPage/woocommerceProductPage/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProductPage/woocommerceProductPage/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Product Page',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceProductPage/woocommerceProductPage/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceProductPage/woocommerceProductPage/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    