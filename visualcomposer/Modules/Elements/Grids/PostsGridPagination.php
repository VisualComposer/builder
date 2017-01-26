<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class PostsGridPagination extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:elements:grids:output', 'addPagination');
    }

    protected function addPagination($output, $payload)
    {
        if ((int)$payload['atts']['pagination']) {
            $output .= vcview('elements/grids/pagination', ['payload' => $payload]);
        }

        return $output;
    }
}
