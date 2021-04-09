<?php

namespace VisualComposer\Modules\Elements\GlobalVariables;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Hub\Elements as HubElements;
use VisualComposer\Helpers\Hub\Categories as HubCategories;
use VisualComposer\Helpers\Hub\Groups as HubGroups;
use VisualComposer\Helpers\AssetsShared;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\GlobalVariables\Controller::getGlobalVariables */
        $this->addFilter(
            'vcv:ajax:elements:globalVariables:adminNonce',
            'getGlobalVariables'
        );
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     * @param \VisualComposer\Helpers\Hub\Elements $hubElements
     * @param \VisualComposer\Helpers\Hub\Categories $hubCategories
     * @param \VisualComposer\Helpers\Hub\Groups $hubGroups
     * @param \VisualComposer\Helpers\AssetsShared $assetsSharedHelper
     *
     * @return array
     */
    protected function getGlobalVariables(
        $response,
        CurrentUser $currentUserAccessHelper,
        HubElements $hubElements,
        HubCategories $hubCategories,
        HubGroups $hubGroups,
        AssetsShared $assetsSharedHelper
    ) {
        $response = [
            'status' => true,
        ];
        // TODO: use proper cap
        if ($currentUserAccessHelper->wpAll(['edit_posts'])->get()) {
            $response['vcvGlobals'] = vcfilter('vcv:editor:variables', []);
        }

        return $response;
    }
}
