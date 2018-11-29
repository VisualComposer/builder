<?php

namespace VisualComposer\Modules\Settings\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\EventsFilters;

class SystemStatusController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::checkVersion */
        $this->addFilter(
            'vcv:ajax:checkVersion:adminNonce',
            'checkVersion'
        );

        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:checkSystem:adminNonce',
            'checkSystem'
        );
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkVersion($response, Update $hubUpdateHelper, Options $optionsHelper)
    {
        $checkVersion = $hubUpdateHelper->checkVersion();
        $response['status'] = $checkVersion['status'];

        if ($response['status'] === true) {
            $optionsHelper->setTransient('lastBundleUpdate', 1);
        }

        return $response;
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Status $statusHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function checkSystem($response, Status $statusHelper, Options $optionsHelper)
    {
        $statusHelper->checkSystemStatusAndSetFlag($optionsHelper);

        return $response;
    }
}
