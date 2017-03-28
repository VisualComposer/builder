<?php

namespace VisualComposer\Modules\Site;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

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
     * Define
     * @var bool
     */
    protected $mainFrontBundle = false;

    /**
     * @var \VisualComposer\Helpers\Url
     */
    protected $urlHelper;

    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    public function __construct(Url $urlHelper)
    {
        $this->urlHelper = $urlHelper;
        /** @see \VisualComposer\Modules\Site\Controller::outputScriptsFront */
        $this->wpAddAction(
            'wp_enqueue_scripts',
            'outputScriptsFront'
        );
    }

    /**
     * Output used assets.
     *
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    public function outputScriptsFront(Request $request, Options $optionsHelper)
    {
        if ($request->exists('vcv-editable')) {
            return false;
        }
        // Add Plugin Vendor File
        $this->addScript('vcv-vendor-scripts', vchelper('Url')->to('public/dist/vendor.bundle.js'));

        $scriptsBundle = $optionsHelper->get('scriptsGlobalFile');
        if (!empty($scriptsBundle)) {
            $this->addScript('vcv-scripts', $scriptsBundle);
        }

        $sharedLibraryCssBundles = $optionsHelper->get('sharedLibraryGlobalFile');
        if (!empty($sharedLibraryCssBundles)) {
            $this->addStyle('vcv-shared-library-styles', $sharedLibraryCssBundles);
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
        wp_register_style($name, $file, [], VCV_VERSION);
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
        /*        if ($this->mainFrontBundle === false) {
                    $this->mainFrontBundle = 'vcv-front-js';
                    $url = $this->urlHelper->to('public/dist/front.bundle.js');
                    wp_register_script($this->mainFrontBundle, $url, [], VCV_VERSION, true);
                }
        */
        wp_register_script($name, $file, [], VCV_VERSION, true);
        $this->wpAddAction(
            'wp_print_scripts',
            function () use ($name) {
                wp_enqueue_script($name);
            }
        );
    }
}
