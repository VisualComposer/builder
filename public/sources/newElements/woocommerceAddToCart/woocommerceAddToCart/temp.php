
        'woocommerceAddToCart' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceAddToCart/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceAddToCart/woocommerceAddToCart/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceAddToCart/woocommerceAddToCart/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Add to Cart',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceAddToCart/woocommerceAddToCart/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceAddToCart/woocommerceAddToCart/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    