<?php

namespace VisualComposer\Modules\Elements\AjaxImageController;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpMedia;

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
        /** @see \VisualComposer\Modules\Elements\AjaxImageController\Controller::customSize */
        $this->addFilter(
            'vcv:ajax:elements:imageController:customSize:adminNonce',
            'customSize'
        );
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\WpMedia $mediaHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function customSize(
        $response,
        Request $request,
        WpMedia $mediaHelper,
        CurrentUser $currentUserAccessHelper
    ) {
        $sourceId = (int)$request->input('vcv-source-id');
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $id = (int)$request->input('vcv-image-id');
            $size = $request->input('vcv-size');
            $image = $mediaHelper->getImageBySize(['attach_id' => $id, 'thumb_size' => $size]);
            if (!is_array($response)) {
                $response = [];
            }
            $response['img'] = $image;
        }

        return $response;
    }
}
