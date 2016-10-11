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
     * Define
     * @var bool
     */
    protected $mainFrontBundle = false;
    /**
     * Controller constructor.
     */
    public function __construct(Url $urlHelper)
    {
        $this->urlHelper =  $urlHelper;
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

    /**
     *
     */
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
     *
     * @return string
     */
    public function outputScriptsFrontendEditor(Templates $templatesHelper)
    {
        /** @see \VisualComposer\Modules\Site\Controller::getAssetsViewArgs */
        $args = $this->call('getAssetsViewArgs');

        return $templatesHelper->render('site/frontend-scripts-styles', $args);
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    public function getAssetsViewArgs(Options $optionsHelper)
    {
        $scriptsBundle = $optionsHelper->get('scriptsBundle');
        $stylesBundle = $optionsHelper->get('stylesBundle');
        $args = compact('scriptsBundle', 'stylesBundle');

        return $args;
    }

    /**
     * Output used assets.
     *
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    public function outputScriptsFrontend(Request $request, Options $optionsHelper)
    {
        if ($request->exists('vcv-editable')) {
            return false;
        }

        $scriptsBundle = $optionsHelper->get('scriptsGlobalFile');
        if ($scriptsBundle !== false) {
            $this->addScript('vcv-scripts', $scriptsBundle);
        }

        $stylesBundle = $optionsHelper->get('stylesGlobalFile');
        if (!empty($stylesBundle)) {
            $this->addStyle('vcv-global-styles', $stylesBundle);
        }

        $postStyles = $optionsHelper->get('postStyles-' . get_the_ID());
        if (!empty($postStyles)) {
            $this->addStyle('vcv-post-styles', $postStyles);
        }

        return true;
    }

    /**
     * @param $name
     * @param $file
     */
    public function addStyle($name, $file)
    {
        wp_register_style($name, $file, VCV_VERSION);
        $this->wpAddAction(
            'wp_print_styles',
            function () use ($name) {
                wp_enqueue_style($name);
            }
        );
    }

    /**
     * @param $name
     * @param $file
     */
    public function addScript($name, $file)
    {
        if ($this->mainFrontBundle === false) {
            $this->mainFrontBundle = 'vcv-front-js';
            $url = $this->urlHelper->to('public/dist/front.bundle.js');
            wp_register_script($this->mainFrontBundle, $url, [], VCV_VERSION, true);
        }
        wp_register_script($name, $file, [$this->mainFrontBundle], VCV_VERSION, true);
        $this->wpAddAction(
            'wp_print_scripts',
            function () use ($name) {
                wp_enqueue_script($name);
            }
        );
    }
}
