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
 * Backward compatibility with GeneratePress theme.
 *
 * @see https://wordpress.org/themes/generatepress/
 */
class GeneratePressController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (get_option('stylesheet') !== 'generatepress') {
            return;
        }

        $this->wpAddAction(
            'vcv:themeEditor:after:header',
            'integrateThemeHeader'
        );

        $this->wpAddAction(
            'vcv:themeEditor:before:footer',
            'integrateThemeFooter'
        );
    }

    /**
     * Integrate additional theme specific optionality to our custom header.
     */
    protected function integrateThemeHeader()
    {
        ob_start();
        echo '<div ';
        generate_do_attr('page');
        echo ' >';
        /**
         * generate_inside_site_container hook.
         *
         * @since 2.4
         */
        do_action('generate_inside_site_container');

        echo '<div ';
        generate_do_attr('site-content');
        echo '>';
        /**
         * generate_inside_container hook.
         *
         * @since 0.1
         */
        do_action('generate_inside_container');
        $outputHelper = vchelper('Output');
        $outputHelper->printNotEscaped(ob_get_clean());
    }

    /**
     * Integrate additional theme specific optionality to our custom footer.
     */
    protected function integrateThemeFooter()
    {
        echo '</div></div>';
    }
}
