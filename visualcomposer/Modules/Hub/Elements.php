<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class Elements
 * @package VisualComposer\Modules\Hub
 */
class Elements extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var
     */
    protected $elements;

    /**
     * Elements constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputElements');

        $temporaryData = true;
        if ($temporaryData) {
            $this->wpAddAction(
                'init',
                'dummySetElements'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function dummySetElements(Options $optionHelper, Url $urlHelper)
    {
        $optionHelper->set(
            'hubElements',
            [
                'row' => [
                    'path' => $urlHelper->to('public/sources/newElements/row/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/row/row/'),
                    'settings' => [
                        'name' => 'Row',
                        'metaThumbnailUrl' => $urlHelper->to('public/sources/newElements/row/row/public/thumbnail-row-column.png'),
                        'metaPreviewUrl' => $urlHelper->to('public/sources/newElements/row/row/public/preview-row-column.jpg'),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'column' => [
                    'path' => $urlHelper->to('public/sources/newElements/column/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/column/column/'),
                    'settings' => [
                        'name' => 'Column',
                        'metaThumbnailUrl' => '',
                        'metaPreviewUrl' => '',
                        'metaDescription' => '',
                    ],
                ],
                'textBlock' => [
                    'path' => $urlHelper->to('public/sources/newElements/textBlock/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/textBlock/textBlock/'),
                    'settings' => [
                        'name' => 'Text Block',
                        'metaThumbnailUrl' => $urlHelper->to('public/sources/newElements/textBlock/textBlock/public/thumbnail-text-block.png'),
                        'metaPreviewUrl' => $urlHelper->to('public/sources/newElements/textBlock/textBlock/public/preview-text-block.jpg'),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'basicButton' => [
                    'path' => $urlHelper->to('public/sources/newElements/basicButton/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/basicButton/basicButton/'),
                    'settings' => [
                        'name' => 'Basic Button',
                        'metaThumbnailUrl' => $urlHelper->to('public/sources/newElements/basicButton/basicButton/public/thumbnail-basic-button.png'),
                        'metaPreviewUrl' => $urlHelper->to('public/sources/newElements/basicButton/basicButton/public/preview-basic-button.png'),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'singleImage' => [
                    'path' => $urlHelper->to('public/sources/newElements/singleImage/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/singleImage/singleImage/'),
                    'settings' => [
                        'name' => 'Single Image',
                        'metaThumbnailUrl' => $urlHelper->to('public/sources/newElements/singleImage/singleImage/public/thumbnail-single-image.png'),
                        'metaPreviewUrl' => $urlHelper->to('public/sources/newElements/singleImage/singleImage/public/preview-single-image.jpg'),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'heroSection' => [
                    'path' => $urlHelper->to('public/sources/newElements/heroSection/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/heroSection/heroSection/'),
                    'settings' => [
                        'name' => 'Hero Section',
                        'metaThumbnailUrl' => $urlHelper->to('public/sources/newElements/heroSection/heroSection/public/thumbnail-hero-section.jpg'),
                        'metaPreviewUrl' => $urlHelper->to('public/sources/newElements/heroSection/heroSection/public/preview-hero-section.jpg'),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
            ]
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionHelper
     *
     * @return array
     */
    protected function outputElements($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elements',
                    [
                        'elements' => $optionHelper->get('hubElements', []),
                    ]
                ),
            ]
        );
    }
}
