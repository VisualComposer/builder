<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class PostDescriptionVariablesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_featured_image',
            'featuredImage'
        );
    }

    protected function featuredImage($result, $payload)
    {
        $url = vcfilter('vcv:elements:grid_item_template:variable:featured_image_url', $result, $payload);
        if ($url) {
            $result = vcview(
                'elements/grids/postdescription-image',
                [
                    'url' => $url,
                ]
            );
        }

        return $result;
    }
}
