<?php

namespace VisualComposer\Modules\Editors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpMedia;

class MediaSizesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\MediaSizesController::addImageSizes */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addImageSizes');
    }

    protected function addImageSizes($scripts, WpMedia $mediaHelper)
    {
        $sizes = [];
        $data = $mediaHelper->getSizes();
        $sizes[] = sprintf('<script>window.vcvImageSizes = %s;</script>', json_encode($data));

        return array_merge($scripts, $sizes);
    }
}
