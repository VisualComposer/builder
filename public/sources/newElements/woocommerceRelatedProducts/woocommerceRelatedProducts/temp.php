
        'woocommerceRelatedProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRelatedProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRelatedProducts/woocommerceRelatedProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Related Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    