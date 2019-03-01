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
    }

    /**
     * @param $pages
     *
     * @return mixed
     */
    protected function addPages($pages)
    {
        $pages[] = [
            'title' => __('Woocommerce Shop', 'vcwb'),
            'name' => 'woocommerce-shop',
        ];
        $pages[] = [
            'title' => __('Woocommerce Cart', 'vcwb'),
            'name' => 'woocommerce-cart',
        ];
        $pages[] = [
            'title' => __('Woocommerce Checkout', 'vcwb'),
            'name' => 'woocommerce-checkout',
        ];
        $pages[] = [
            'title' => __('Woocommerce My Account', 'vcwb'),
            'name' => 'woocommerce-account',
        ];
        $pages[] = [
            'title' => __('Woocommerce Terms', 'vcwb'),
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
        if ($sourceId && wc_get_page_id('terms') === $sourceId
            && $optionsHelper->get(
                'headerFooterSettingsPageType-woocommerce-terms'
            )) {
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
}
