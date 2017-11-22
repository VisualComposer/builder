<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class PostsGridPagination extends Container implements Helper
{
    public function getPaginationUrl($id, $page)
    {
        return add_query_arg('vcv-pagination-' . $id, $page);
    }
}
