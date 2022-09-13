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
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\WpMedia;

class MediaSizesController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\MediaSizesController::registerImageSizes */
        $this->wpAddAction('after_setup_theme', 'registerImageSizes');

        /** @see \VisualComposer\Modules\Editors\MediaSizesController::addImageSizes */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addImageSizes');
    }

    /**
     * Register custom image sizes into WordPress
     *
     * @return void
     */
    protected function registerImageSizes()
    {
        // crop MUST be false to keep the aspect ratio
        add_image_size('320w', 320);
        add_image_size('480w', 480);
        add_image_size('800w', 800);
    }

    protected function addImageSizes($scripts, WpMedia $mediaHelper)
    {
        $sizes = [];
        $data = $mediaHelper->getSizes();
        $sizes[] = sprintf('<script>window.vcvImageSizes = %s;</script>', wp_json_encode($data));

        return array_merge($scripts, $sizes);
    }
}
