<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostFields;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostFieldsController
 * @package VisualComposer\Modules\Editors\DataAjax
 */
class PostFieldsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getPostFields'
        );
    }

    /**
     * @param $response
     * @param $payload
     *
     * @return mixed
     */
    protected function getPostFields($response, $payload, PostFields $postFieldsHelper)
    {
        $response['postFields'] = vcfilter('vcv:editor:data:postFields', $postFieldsHelper->getDefaultPostFields());

        return $response;
    }
}
