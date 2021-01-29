<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WooCommerceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (!class_exists('WooCommerce')) {
            return;
        }

        $this->addFilter('vcv:themeEditor:settingsController:addPages', 'addPages');
        $this->addFilter('vcv:themeEditor:layoutController:getTemplatePartId', 'getTemplatePartId');
        $this->addFilter('vcv:editors:editPostLinks:adminRowLinks', 'isShop');
        $this->addFilter('vcv:themeEditor:layoutController:getOtherPageTemplatePartData:isArchive', 'isCategory');
        $this->addFilter('vcv:ajax:elements:ajaxShortcode:adminNonce', 'removeGeoLocation', -1);
    }

    /**
     * @param $pages
     *
     * @return mixed
     */
    protected function addPages($pages)
    {
        $pages[] = [
            'title' => __('Woocommerce Shop', 'visualcomposer'),
            'name' => 'woocommerce-shop',
        ];
        $pages[] = [
            'title' => __('Woocommerce Cart', 'visualcomposer'),
            'name' => 'woocommerce-cart',
        ];
        $pages[] = [
            'title' => __('Woocommerce Checkout', 'visualcomposer'),
            'name' => 'woocommerce-checkout',
        ];
        $pages[] = [
            'title' => __('Woocommerce My Account', 'visualcomposer'),
            'name' => 'woocommerce-account',
        ];
        $pages[] = [
            'title' => __('Woocommerce Product Category', 'visualcomposer'),
            'name' => 'woocommerce-category',
        ];
        $pages[] = [
            'title' => __('Woocommerce Terms', 'visualcomposer'),
            'name' => 'woocommerce-terms',
        ];

        return $pages;
    }

    public function getTemplatePartId($response, $payload)
    {
        $templatePart = $payload['templatePart'];
        if (!$response['pageFound'] && $response['replaceTemplate']) {
            if ($this->getShopTemplatePart($templatePart)) {
                return $this->getShopTemplatePart($templatePart);
            } elseif ($this->getAccountTemplatePart($templatePart)) {
                return $this->getAccountTemplatePart($templatePart);
            } elseif ($this->getCheckoutTemplatePart($templatePart)) {
                return $this->getCheckoutTemplatePart($templatePart);
            } elseif ($this->getCartTemplatePart($templatePart)) {
                return $this->getCartTemplatePart($templatePart);
            } elseif ($this->getCategoryTemplatePart($templatePart)) {
                return $this->getCategoryTemplatePart($templatePart);
            } elseif ($this->getTermsTemplatePart($templatePart)) {
                return $this->getTermsTemplatePart($templatePart);
            }
        }

        return $response;
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getCartTemplatePart($templatePart)
    {
        $optionsHelper = vchelper('Options');
        if ((is_cart()) && $optionsHelper->get('headerFooterSettingsPageType-woocommerce-cart')) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-cart'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getTermsTemplatePart($templatePart)
    {
        $sourceId = get_the_ID();
        $optionsHelper = vchelper('Options');
        if (
            $sourceId && wc_get_page_id('terms') === $sourceId
            && $optionsHelper->get(
                'headerFooterSettingsPageType-woocommerce-terms'
            )
        ) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-terms'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getCategoryTemplatePart($templatePart)
    {
        $optionsHelper = vchelper('Options');
        if (is_product_category() && $optionsHelper->get('headerFooterSettingsPageType-woocommerce-category')) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-category'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getCheckoutTemplatePart($templatePart)
    {
        $optionsHelper = vchelper('Options');
        if ((is_checkout()) && $optionsHelper->get('headerFooterSettingsPageType-woocommerce-checkout')) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-checkout'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getAccountTemplatePart($templatePart)
    {
        $optionsHelper = vchelper('Options');
        if ((is_account_page()) && $optionsHelper->get('headerFooterSettingsPageType-woocommerce-account')) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-account'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    protected function getShopTemplatePart($templatePart)
    {
        $optionsHelper = vchelper('Options');
        if (is_shop() && $optionsHelper->get('headerFooterSettingsPageType-woocommerce-shop')) {
            $templatePartId = $optionsHelper->get(
                'headerFooterSettingsPageType' . ucfirst($templatePart) . '-woocommerce-shop'
            );
            if ($templatePart) {
                return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => $templatePartId];
            }

            return ['pageFound' => true, 'replaceTemplate' => true, 'sourceId' => false];
        }
    }

    /**
     * @param $response
     * @param $payload
     *
     * @return bool|mixed
     */
    protected function isShop($response, $payload)
    {
        if ($payload['sourceId'] === wc_get_page_id('shop')) {
            return false;
        }

        return $response;
    }

    /**
     * @return bool
     */
    protected function isCategory()
    {
        if (is_archive() && is_product_category()) {
            return false;
        }

        return true;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getPrice($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return wc_price($product->get_price());
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getRegularPrice($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return wc_price($product->get_regular_price());
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getSalePrice($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return wc_price($product->get_sale_price());
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getShortDescription($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return $product->get_short_description();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getWeight($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return wc_format_weight($product->get_weight());
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDimensions($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        $length = $product->get_length();
        $width = $product->get_width();
        $height = $product->get_height();
        $response = '';
        if ($length) {
            $response .= esc_html__('Length:') . ' ' . $length . ' ' . get_option('woocommerce_dimension_unit')
                . '<br/>';
        }
        if ($width) {
            $response .= esc_html__('Width:') . ' ' . $width . ' ' . get_option('woocommerce_dimension_unit') . '<br/>';
        }
        if ($height) {
            $response .= esc_html__('Height:') . ' ' . $height . ' ' . get_option('woocommerce_dimension_unit');
        }

        return $response;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getAvailability($sourceId = '')
    {
        $product = wc_get_product($sourceId);
        $availability = $product->get_availability();

        return $availability['availability'];
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getTotalSales($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return (string)$product->get_total_sales();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getAverageRating($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return $product->get_average_rating();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getRatingCount($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return $product->get_rating_count();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDateOnSaleTo($sourceId = '')
    {
        $product = wc_get_product($sourceId);
        if ($product->get_date_on_sale_to()) {
            return date(wc_date_format() . ' ' . wc_time_format(), $product->get_date_on_sale_to()->getTimestamp());
        }

        return false;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDateOnSaleFrom($sourceId = '')
    {
        $product = wc_get_product($sourceId);
        if ($product->get_date_on_sale_from()) {
            return date(wc_date_format() . ' ' . wc_time_format(), $product->get_date_on_sale_from()->getTimestamp());
        }

        return false;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDownloads($sourceId = '')
    {
        $product = wc_get_product($sourceId);
        $fileData = $product->get_downloads();
        if ($fileData) {
            $fileLinks = [];
            foreach ($fileData as $file) {
                $fileLinks[] = '<a href="' . esc_url($file['file']) . '" target="_blank" rel="noopener noreferrer">' . esc_html($file['name'])
                    . '</a>';
            }

            return implode(',', $fileLinks);
        }

        return false;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDownloadExpiry($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return (string)$product->get_download_expiry();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getDownloadLimit($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return (string)$product->get_download_limit();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getStockQuantity($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return (string)$product->get_stock_quantity();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getSku($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return $product->get_sku();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getProductUrl($sourceId = '')
    {
        $url = get_permalink($sourceId);

        return $url;
    }

    /**
     * @return string
     */
    public function getShopUrl()
    {
        $url = get_permalink(wc_get_page_id('shop'));

        return $url;
    }

    /**
     * @return string
     */
    public function getCheckoutUrl()
    {
        $url = wc_get_checkout_url();

        return $url;
    }

    /**
     * @return string
     */
    public function getCartUrl()
    {
        $url = wc_get_cart_url();

        return $url;
    }

    /**
     * @param $sourceId
     *
     * @return string
     */
    public function getAddToCartUrl($sourceId)
    {
        $url = wc_get_cart_url();

        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $url = add_query_arg('add-to-cart', $sourceId, $url);

        return $url;
    }

    /**
     * @return string
     */
    public function getAccountUrl()
    {
        $accountPageId = get_option('woocommerce_myaccount_page_id');
        $url = get_permalink($accountPageId);

        return $url;
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getPurchaseNote($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return $product->get_purchase_note();
    }

    /**
     * @param string $sourceId
     *
     * @return string
     */
    public function getCategories($sourceId = '')
    {
        $product = wc_get_product($sourceId);

        return get_the_term_list($product->get_id(), 'product_cat', null, ', ');
    }

    /**
     * Deregister WooCommerce GeoLocation Script
     *
     * @param $response
     *
     * @return mixed
     */
    protected function removeGeoLocation($response)
    {
        $this->wpAddAction(
            'wp_footer',
            function () {
                wp_deregister_script('wc-geolocation');
            },
            1
        );

        return $response;
    }
}
