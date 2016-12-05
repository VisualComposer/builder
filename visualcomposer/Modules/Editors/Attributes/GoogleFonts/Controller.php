<?php

namespace VisualComposer\Modules\Editors\Attributes\GoogleFonts;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $options;

    public function __construct(Options $optionsHelper)
    {
        $this->options = $optionsHelper;

        /** @see \VisualComposer\Modules\Editors\Attributes\GoogleFonts\Controller::enqueueGoogleFontsScripts */
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueGoogleFontsScripts');

        /** @see \VisualComposer\Modules\Editors\Attributes\GoogleFonts\Controller::saveGoogleFonts */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'saveGoogleFonts'
        );
    }

    /**
     * Enqueue google fonts assets.
     */
    private function enqueueGoogleFontsScripts()
    {
        $googleFonts = $this->options->get('googleFonts', []);

        foreach ($googleFonts as $font) {
            wp_enqueue_script('vcv:' . $font, $font);
        }
    }

    /**
     * Save google fonts.
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array
     */
    private function saveGoogleFonts($response, Request $requestHelper)
    {
        $googleFonts = $requestHelper->input('vcv-google-fonts');
        $this->options->set('googleFonts', array_values((array)$googleFonts));
        $response['status'] = true;

        return $response;
    }
}
