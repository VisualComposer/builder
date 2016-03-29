<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Modules\Settings\Traits\Page;

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
    /**
     * @var string
     */
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
        $this->optionGroup = 'vc-v-general';
        $this->optionSlug = 'vc-v-general';
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\General::addPage */
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'vcv:settings:initAdmin:page:' . $this->getSlug(),
            function () {
                /** @see \VisualComposer\Modules\Settings\Pages\General::buildPage */
                $this->call('buildPage');
            }
        );
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
        $this->addSection(
            [
                'page' => $this->getSlug(),
            ]
        );

        // Disable responsive content elements
        $fieldCallback = function ($data) {
            /** @see \VisualComposer\Modules\Settings\Pages\General::disableResponsiveFieldCallback */
            return $this->call('disableResponsiveFieldCallback', [$data]);
        };

        $this->addField(
            [
                'page' => $this->getSlug(),
                'title' => __('Disable responsive content elements', 'vc5'),
                'name' => 'not_responsive_css',
                'fieldCallback' => $fieldCallback,
            ]
        );

        // Google fonts subsets
        $sanitizeCallback = function ($data) {
            /** @see \VisualComposer\Modules\Settings\Pages\General::sanitizeGoogleFontsSubsetsFieldCallback */
            return $this->call('sanitizeGoogleFontsSubsetsFieldCallback', [$data]);
        };
        $fieldCallback = function ($data) {
            /** @see \VisualComposer\Modules\Settings\Pages\General::googleFontsSubsetsFieldCallback */
            return $this->call('googleFontsSubsetsFieldCallback', [$data]);
        };

        $this->addField(
            [
                'page' => $this->getSlug(),
                'title' => __('Google fonts subsets', 'vc5'),
                'name' => 'google_fonts_subsets',
                'fieldCallback' => $fieldCallback,
                'sanitizeCallback' => $sanitizeCallback,
            ]
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
    private function disableResponsiveFieldCallback(Options $options)
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
    private function sanitizeGoogleFontsSubsetsFieldCallback($subsetsToSanitize)
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
    private function googleFontsSubsetsFieldCallback(Options $options)
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
