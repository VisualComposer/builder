<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use visualComposer\Helpers\Options;

/**
 * Class FrontViewController
 * @package VisualComposer\Modules\FrontView
 */
class HeadersFootersController extends Container implements Module
{
    use WpFiltersActions;

    protected $settings = [];

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        $this->call('initSettings');
        $this->call('initialize');
    }

    /**
     * @param \visualComposer\Helpers\Options $optionsHelper
     * Keep the local copy of settings values
     */
    protected function initSettings(Options $optionsHelper)
    {
        $overrideHeadersFooters = $optionsHelper->get('headerFooterSettings');
        if ($overrideHeadersFooters && in_array('headers-footers-override', $overrideHeadersFooters)) {
            $this->settings['overrideHeadersFooters'] = true;
        }

        $headerFooterSettingsAllHeader = $optionsHelper->get('headerFooterSettingsAllHeader');
        if ($headerFooterSettingsAllHeader) {
            $this->settings['headerFooterSettingsAllHeader'] = $headerFooterSettingsAllHeader;
        }
        $headerFooterSettingsAllFooter = $optionsHelper->get('headerFooterSettingsAllFooter');
        if ($headerFooterSettingsAllFooter) {
            $this->settings['headerFooterSettingsAllFooter'] = $headerFooterSettingsAllFooter;
        }
    }

    /**
     * Initializes headers and footers if enabled
     */
    protected function initialize()
    {
        if ($this->getSettings('overrideHeadersFooters')) {
            $this->wpAddAction('get_header', 'getHeader');
            $this->wpAddAction('get_footer', 'getFooter');
        }
    }

    /**
     * @param $key
     *
     * @return bool|mixed
     *
     * To retrieve the value by key
     */
    protected function getSettings($key)
    {
        if (isset($this->settings[ $key ])) {
            return $this->settings[ $key ];
        }

        return false;
    }

    /**
     * @param $name
     *
     * To replace the header
     */
    protected function getHeader($name)
    {
        $sourceId = $this->getSettings('headerFooterSettingsAllHeader');
        if (!$sourceId) {
            return;
        }

        evcview(
            'headers-footers/header',
            [
                'sourceId' => $sourceId,
            ]
        );

        $predefinedtemplates = [
            'header.php',
        ];
        if ($name) {
            $predefinedtemplates[] = "header-{$name}.php";
        }

        remove_all_actions('wp_head');
        $this->extract($predefinedtemplates);
    }

    /**
     * @param $name
     *
     * To replace the footer
     */
    protected function getFooter($name)
    {
        $sourceId = $this->getSettings('headerFooterSettingsAllFooter');
        if (!$sourceId) {
            return;
        }

        evcview(
            'headers-footers/footer',
            [
                'sourceId' => $sourceId,
            ]
        );

        $predefinedtemplates = [
            'footer.php',
        ];
        if ($name) {
            $predefinedtemplates[] = "footer-{$name}.php";
        }

        $this->extract($predefinedtemplates);
    }

    protected function extract($templates)
    {
        ob_start();
        locate_template($templates, true);
        ob_get_clean();
    }
}
