<?php

namespace VisualComposer\Modules\Elements\Grids;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

/**
 * Class PostsGridController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostsGridController extends Container /*implements Module*/
{
    use EventsFilters;
    use ShortcodesTrait;

    protected $shortcodeTag = 'vcv_posts_grid';

    /**
     * PostsGridController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditor */
        $this->addFilter('vcv:ajax:elements:posts_grid:adminNonce', 'renderEditor');
    }
}
