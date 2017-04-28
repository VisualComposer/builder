
        'woocommerceBestSellingProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceBestSellingProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Best-Selling Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    