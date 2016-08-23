<?php

namespace VisualComposer\Modules\Site;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Templates;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Framework\Container;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * @var bool
     */
    protected static $jsScriptRendered = false;

    /**
     * @var \VisualComposer\Helpers\Events
     */
    protected $event;

    /**
     * Controller constructor.
     */
    public function __construct()
    {

        /** @see \VisualComposer\Modules\Site\Controller::outputScriptsFrontend */
        $this->wpAddAction(
            'wp_enqueue_scripts',
            'outputScriptsFrontend'
        );

        $this->wpAddAction(
            'wp_enqueue_scripts',
            function () {
                wp_enqueue_script('jquery');
            }
        );
    }

    /**
     * Output less.js script to page header.
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return string
     */
    public function appendScript(Url $urlHelper)
    {
        echo '<script src="' . esc_url($urlHelper->to('node_modules/less/dist/less.js'))
            . '" data-async="true"></script>';
    }

    /**
     * Output used assets.
     *
     * @param \VisualComposer\Helpers\Templates $templatesHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return string
     */
    public function outputScriptsFrontendEditor(Templates $templatesHelper, Options $optionsHelper)
    {
        $scriptsBundle = $optionsHelper->get('scriptsBundle');
        $stylesBundle = $optionsHelper->get('stylesBundle');
        $args = compact('scriptsBundle', 'stylesBundle');
        return $templatesHelper->render('site/frontend-scripts-styles', $args);
    }
    /**
     * Output used assets.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     */
    public function outputScriptsFrontend(Options $optionsHelper)
    {
        $scriptsBundle = $optionsHelper->get('scriptsBundle');
        if($scriptsBundle !== false) {
            wp_register_script('vcv-script', $scriptsBundle, ['jquery'], VCV_VERSION, true);
            $this->wpAddAction('wp_print_scripts', function() {
                wp_enqueue_script('vcv-script');
            });
        }
        $stylesBundle = $optionsHelper->get('stylesBundle');
        if($stylesBundle !== false) {
            wp_register_style('vcv-styles', $stylesBundle, VCV_VERSION);
            $this->wpAddAction('wp_print_styles', function() {
                wp_enqueue_style('vcv-styles');
            });
        }
    }
}
