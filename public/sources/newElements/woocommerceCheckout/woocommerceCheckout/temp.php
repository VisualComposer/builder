
        'woocommerceCheckout' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCheckout/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCheckout/woocommerceCheckout/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/woocommerceCheckout/woocommerceCheckout/public/'
            ),
            'settings' => [
                'name' => 'WooCommerce Checkout',
                'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/woocommerceCheckout/woocommerceCheckout/public/thumbnail.jpg'
                ),
                'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/woocommerceCheckout/woocommerceCheckout/public/preview.jpg'
                ),
                'metaDescription' => 'Long description',
            ],
        ],
    