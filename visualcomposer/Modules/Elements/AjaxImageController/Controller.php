<?php

namespace VisualComposer\Modules\Elements\AjaxImageController;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
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
        /** @see \VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller::ajaxShortcodeRender */
        $this->addFilter(
            'vcv:ajax:elements:imageController:customSize',
            'customSize'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    private function customSize(Request $request, $response, WpMedia $mediaHelper)
    {
        $id = $request->input('vcv-image-id');
        $size = $request->input('vcv-size');
        $image = $mediaHelper->getImageBySize(['attach_id' => $id, 'thumb_size' => $size]);
        $response['img'] = $image;

        return $response;

    }
}
