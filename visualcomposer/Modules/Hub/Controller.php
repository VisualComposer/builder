<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;

class Controller extends Module implements Container
{
    protected $elements;

    protected function outputElements(Options $optionHelper)
    {
        return vcview(
            'hub/elements',
            [
                'elements' => $optionHelper->get('elements', []),
            ]
        );
    }

    protected function outputCategories()
    {
        return vcview(
            'hub/categories',
            [
                'categories' => $optionHelper->get('categories', []),
            ]
        );
    }
}
