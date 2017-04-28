
        'woocommerceProducts' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProducts/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProducts/woocommerceProducts/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceProducts/woocommerceProducts/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Products',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceProducts/woocommerceProducts/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceProducts/woocommerceProducts/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    