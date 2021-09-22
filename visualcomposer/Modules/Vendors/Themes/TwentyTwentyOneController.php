<?php

namespace VisualComposer\Modules\Vendors\Themes;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with TwentyTwentyOne theme
 *
 * @see https://wordpress.org/themes/twentytwentyone
 */
class TwentyTwentyOneController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (get_option('stylesheet') !== 'twentytwentyone') {
            return;
        }

        $this->wpAddAction('wp_head', 'enqueueTwentyTwentyOneStyles');
    }

    protected function enqueueTwentyTwentyOneStyles()
    {
        $urlHelper = vchelper('Url');
        wp_register_style('vcv:twentyTwentyOne:styles', $urlHelper->to('visualcomposer/Modules/Vendors/VendorStyles/twentyTwentyOne.css'));
        wp_enqueue_style('vcv:twentyTwentyOne:styles');
    }
}
