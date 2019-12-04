<?php

namespace VisualComposer\Modules\Hub\Elements\Teasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class TeasersController
 * @package VisualComposer\Modules\Hub\Elements\Teasers
 */
class TeasersController extends Container implements Module
{
    use EventsFilters;

    /**
     * TeasersController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:frontend:head:extraOutput', 'outputTeaserElements');
        $this->addFilter('vcv:frontend:head:extraOutput', 'outputTeaserBadge');
        $this->addFilter('vcv:ajax:vcv:hub:teaser:visit:adminNonce', 'ajaxSetTeaserBadge');

        $this->addFilter('vcv:frontend:head:extraOutput', 'outputTeaserDownload');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function outputTeaserElements($response, $payload, Options $optionsHelper)
    {
        $value = array_values(
            (array)$optionsHelper->get(
                'hubTeaserElements',
                [
                    'All Elements' => [
                        'id' => 'AllElements0',
                        'index' => 0,
                        'title' => 'All Elements',
                        'elements' => [],
                    ],
                ]
            )
        );

        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_TEASER',
                        'value' => $value,
                    ]
                ),
            ]
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function outputTeaserBadge($response, $payload, Options $optionsHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/variable',
                    [
                        'key' => 'vcvHubTeaserShowBadge',
                        'value' => version_compare(
                            $optionsHelper->getUser('hubTeaserVisit'),
                            $optionsHelper->get('hubAction:hubTeaser', '1.0'),
                            '<'
                        ),
                    ]
                ),
            ]
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function ajaxSetTeaserBadge(Options $optionsHelper)
    {
        $optionsHelper->setUser('hubTeaserVisit', $optionsHelper->get('hubAction:hubTeaser'));

        return true;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array
     */
    protected function outputTeaserDownload($response, $payload, License $licenseHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_ALLOW_DOWNLOAD',
                        'value' => $licenseHelper->isAnyActivated(),
                    ]
                ),
            ]
        );
    }
}
