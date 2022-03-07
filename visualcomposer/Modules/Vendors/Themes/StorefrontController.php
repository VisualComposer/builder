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
 * Backward compatibility with Storefront theme
 *
 * @see https://wordpress.org/themes/storefront
 */
class StorefrontController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (get_option('stylesheet') !== 'storefront') {
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

        $this->wpAddFilter(
            'body_class',
            'addBodyClass',
            10,
            1
        );
    }

    /**
     * Add body class.
     *
     * @param array $classList
     *
     * @return mixed
     */
    protected function addBodyClass($classList)
    {
        if (is_array($classList)) {
            $classList[] = 'site-main';
        } else {
            $classList = ['site-main'];
        }

        return $classList;
    }

    /**
     * Integrate additional theme specific optionality to our custom header.
     */
    protected function integrateThemeHeader()
    {
        echo '<div id="content" class="site-content" tabindex="-1"><div class="col-full">';

        do_action('storefront_content_top');
    }

    /**
     * Integrate additional theme specific optionality to our custom footer.
     */
    protected function integrateThemeFooter()
    {
        echo '</div></div>';

        do_action('storefront_before_footer');
    }
}
