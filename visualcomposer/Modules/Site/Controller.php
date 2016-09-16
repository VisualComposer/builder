<?php

namespace VisualComposer\Modules\Site;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Templates;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Request;

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

        /** @see \VisualComposer\Modules\Site\Controller::enqueueScripts */
        $this->wpAddAction(
            'wp_enqueue_scripts',
            'enqueueScripts'
        );
    }

    public function enqueueScripts()
    {
        wp_enqueue_script('jquery');
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
        return '<script src="' . esc_url($urlHelper->to('node_modules/less/dist/less.js'))
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
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    public function outputScriptsFrontend(Request $request, Options $optionsHelper)
    {
        if ($request->exists('vcv-editable')) {
            return;
        }
        $scriptsBundle = $optionsHelper->get('scriptsBundle');
        if ($scriptsBundle !== false) {
            wp_register_script('vcv-script', $scriptsBundle, ['jquery'], VCV_VERSION, true);
            $this->wpAddAction(
                'wp_print_scripts',
                function () {
                    wp_enqueue_script('vcv-script');
                }
            );
        }
        $stylesBundle = $optionsHelper->get('stylesGlobalFile');
        if (!empty($stylesBundle)) {
            wp_register_style('vcv-global-styles', $stylesBundle, VCV_VERSION);
            $this->wpAddAction(
                'wp_print_styles',
                function () {
                    wp_enqueue_style('vcv-global-styles');
                }
            );
        }
        $postStyles = $optionsHelper->get('postStyles-' . get_the_ID());
        if (!empty($postStyles)) {
            wp_register_style('vcv-post-styles', $postStyles, VCV_VERSION);
            $this->wpAddAction(
                'wp_print_styles',
                function () {
                    wp_enqueue_style('vcv-post-styles');
                }
            );
        }
    }
}
