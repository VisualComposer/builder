
        'woocommerceSaleProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceSaleProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceSaleProducts/woocommerceSaleProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceSaleProducts/woocommerceSaleProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Sale Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceSaleProducts/woocommerceSaleProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceSaleProducts/woocommerceSaleProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    