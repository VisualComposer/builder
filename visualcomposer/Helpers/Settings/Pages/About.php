<?php

namespace VisualComposer\Helpers\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class About implements Helper
{
    /**
     * Retrieves list of slides for latest activation page
     * @return array
     */
    public function getSlides()
    {
        $urlHelper = vchelper('Url');

        return [
            [
                'title' => __('Set up your own navigation position or change it at any time.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/001.gif'),
            ],
            [
                'title' => __('Access and see the path to your elements, columns, and rows from one control.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/002.gif'),
            ],
            [
                'title' => __('Use inline text editing to change content with one click.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/003.gif'),
            ],
            [
                'title' => __('Control and overview your page structure from the Tree View mode.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/004.gif'),
            ],
            [
                'title' => __('Divide your row into columns with Row layout and pre-made layouts.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/005.gif'),
            ],
            [
                'title' => __('Apply changes instantly and revert back with Undo/Redo at any time.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/006.gif'),
            ],
            [
                'title' => __('Resize columns with easy to use resize tool.', 'vcwb'),
                'url' => $urlHelper->assetUrl('images/account/007.gif'),
            ],
        ];
    }
}
