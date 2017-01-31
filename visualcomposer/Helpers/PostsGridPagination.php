<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class PostsGridPagination extends Container implements Helper
{
    public function getPaginationUrl($id, $page)
    {
        return home_url(add_query_arg('vcv-pagination-' . $id, $page));
    }
}
