<?php

namespace VisualComposer\Modules\Assets;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\Traits\EventsFilters;

class SharedController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'outputSharedLibraries');
    }

    protected function outputSharedLibraries($response, $payload, AssetsShared $assetsSharedHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'assets/shared',
                    [
                        'assets' => $assetsSharedHelper->getSharedAssets(),
                    ]
                ),
            ]
        );
    }
}
