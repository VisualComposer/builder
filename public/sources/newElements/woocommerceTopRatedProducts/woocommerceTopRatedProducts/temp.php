
        'woocommerceTopRatedProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceTopRatedProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Top Rated Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    