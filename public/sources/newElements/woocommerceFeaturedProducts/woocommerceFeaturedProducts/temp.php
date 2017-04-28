
        'woocommerceFeaturedProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceFeaturedProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Featured Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    