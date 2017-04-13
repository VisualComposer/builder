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
        /** @see \VisualComposer\Modules\Hub\Elements::outputElements */
        $this->addFilter('vcv:frontend:head:extraOutput vcv:backend:extraOutput', 'outputElements');
        $this->addFilter('vcv:frontend:footer:extraOutput vcv:backend:extraOutput', 'outputElementsBundle', 3);

        $temporaryData = true;
        if ($temporaryData) {
            /** @see \VisualComposer\Modules\Hub\Elements::dummySetElements */
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
                    'bundlePath' => $urlHelper->to('public/sources/newElements/row/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/row/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/row/element/public/'),
                    'settings' => [
                        'name' => 'Row',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/row/element/public/thumbnail-row-column.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/row/element/public/preview-row-column.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'column' => [
                    'bundlePath' => $urlHelper->to('public/sources/newElements/column/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/column/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/column/element/public/'),
                    'settings' => [
                        'name' => 'Column',
                        'metaThumbnailUrl' => '',
                        'metaPreviewUrl' => '',
                        'metaDescription' => '',
                    ],
                ],
                'textBlock' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/textBlock/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/textBlock/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/textBlock/element/public'),
                    'settings' => [
                        'name' => 'Text Block',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/textBlock/element/public/thumbnail-text-block.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/textBlock/element/public/preview-text-block.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'basicButton' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/basicButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/basicButton/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/basicButton/element/public/'),
                    'settings' => [
                        'name' => 'Basic Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/basicButton/element/public/thumbnail-basic-button.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/basicButton/element/public/preview-basic-button.png'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'singleImage' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/singleImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/singleImage/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/singleImage/element/public/'),
                    'settings' => [
                        'name' => 'Single Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/singleImage/element/public/thumbnail-single-image.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/singleImage/element/public/preview-single-image.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'heroSection' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/heroSection/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/heroSection/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/heroSection/element/public/'),
                    'settings' => [
                        'name' => 'Hero Section',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/heroSection/element/public/thumbnail-hero-section.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/heroSection/element/public/preview-hero-section.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'icon' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/icon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/icon/element/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/icon/element/public/'),
                    'settings' => [
                        'name' => 'Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/icon/element/public/thumbnail-icon.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/icon/element/public/preview-icon.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'googleFontsHeading' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/element/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/element/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Fonts Heading',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleFontsHeading/element/public/google-fonts-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleFontsHeading/element/public/google-fonts-preview.png'
                        ),
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

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionHelper
     *
     * @return array
     */
    protected function outputElementsBundle($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elementsBundle',
                    [
                        'elements' => $optionHelper->get('hubElements', []),
                    ]
                ),
            ]
        );
    }
}
