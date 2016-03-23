<?php

namespace VisualComposer\Modules\Settings\Pages;

//use VisualComposer\Helpers\Generic\Todo;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Fields;
use VisualComposer\Modules\Settings\Page;

/**
 * Class General
 * @package VisualComposer\Modules\Settings\Pages
 */
class General extends Container
{
    use Fields;
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-general';
    protected $templatePath = 'settings/pages/general/index';
    /**
     * @var array
     */
    private $googleFontsSubsetsExcluded = [];
    /**
     * @var array
     */
    private $googleFontsSubsets = [
        'latin',
        'vietnamese',
        'cyrillic',
        'latin-ext',
        'greek',
        'cyrillic-ext',
        'greek-ext',
    ];

    /**
     * General constructor.
     */
    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                return $this->call('addPage', [$pages]);
            }
        );

       /* add_action(
            'vc:v:settings:initAdmin:page:' . $this->getSlug(),
            function () {
                $this->call('buildPage');
            }
        );*/
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('General Settings', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * Page: General Settings
     */
    public function buildPage()
    {
        $page = $this->slug;

        $this->addSection($page);

        // Disable responsive content elements

        $fieldCallback = function () {
            $args = func_get_args();

            return $this->call('disableResponsiveFieldCallback', $args);
        };

        $this->addField(
            $page,
            __('Disable responsive content elements', 'vc5'),
            'not_responsive_css',
            null,
            $fieldCallback
        );

        // Google fonts subsets

        $sanitizeCallback = function () {
            $args = func_get_args();

            return $this->call('sanitizeGoogleFontsSubsetsFieldCallback', $args);
        };

        $fieldCallback = function () {
            $args = func_get_args();

            return $this->call('googleFontsSubsetsFieldCallback', $args);
        };

        $this->addField(
            $page,
            __('Google fonts subsets', 'vc5'),
            'google_fonts_subsets',
            $sanitizeCallback,
            $fieldCallback
        );
    }

    /**
     * @return array
     */
    public function getGoogleFontsSubsetsExcluded()
    {
        return $this->googleFontsSubsetsExcluded;
    }

    /**
     * @param $excluded
     *
     * @return bool
     */
    public function setGoogleFontsSubsetsExcluded($excluded)
    {
        if (is_array($excluded)) {
            $this->googleFontsSubsetsExcluded = $excluded;

            return true;
        }

        return false;
    }

    /**
     * @return array
     */
    public function getGoogleFontsSubsets()
    {
        return $this->googleFontsSubsets;
    }

    /**
     * Not responsive checkbox callback function
     */
    public function disableResponsiveFieldCallback(Options $options)
    {
        $checked = $options->get('not_responsive_css', false);

        vcview(
            'settings/pages/general/partials/disable-responsive',
            [
                'checked' => $checked,
            ]
        );
    }

    /**
     * @param array $subsetsToSanitize
     *
     * @return array
     */
    public function sanitizeGoogleFontsSubsetsFieldCallback($subsetsToSanitize)
    {
        $sanitized = [];

        if (isset($subsetsToSanitize) && is_array($subsetsToSanitize)) {
            $excluded = $this->getGoogleFontsSubsetsExcluded();
            $subsets = $this->getGoogleFontsSubsets();

            foreach ($subsetsToSanitize as $subset) {
                if (!in_array($subset, $excluded) && in_array($subset, $subsets)) {
                    $sanitized[] = $subset;
                }
            }
        }

        return $sanitized;
    }

    /**
     * Google fonts subsets callback
     * @param \VisualComposer\Helpers\WordPress\Options $options
     */
    public function googleFontsSubsetsFieldCallback(Options $options)
    {
        $checkedSubsets = $options->get('google_fonts_subsets', $this->getGoogleFontsSubsets());

        $excluded = $this->getGoogleFontsSubsetsExcluded();
        $subsets = [];

        foreach ($this->getGoogleFontsSubsets() as $subset) {
            if (in_array($subset, $excluded)) {
                continue;
            }

            $subsets[] = [
                'title' => $subset,
                'checked' => in_array($subset, $checkedSubsets),
            ];
        }

        vcview(
            'settings/pages/general/partials/google-fonts-subsets',
            [
                'subsets' => $subsets,
            ]
        );
    }
}
