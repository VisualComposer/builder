<?php

namespace VisualComposer\Modules\Account;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class DeactivationController
 * @package VisualComposer\Modules\Account
 */
class DeactivationController extends Container implements Module
{
    use EventsFilters;

    /**
     * DeactivationController constructor.
     */
    public function __construct()
    {
        $this->addEvent('vcv:system:deactivation:hook vcv:system:factory:reset', 'unsetOptions');
        if (vcvenv('VCV_ENV_LICENSES')) {
            $this->addFilter('vcv:ajax:account:deactivation:ping', 'pingDeactivation');
        }
    }

    /**
     * @param \VisualComposer\Helpers\Token $tokenHelper
     */
    protected function unsetOptions(Token $tokenHelper)
    {
        $tokenHelper->reset();
    }

    /**
     * Force license deactivation
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function pingDeactivation(Request $requestHelper, License $licenseHelper, Options $optionsHelper)
    {
        $code = $requestHelper->input('code');
        if ($code && $licenseHelper->isActivated()) {
            if ($code === sha1($licenseHelper->getKey())) {
                $optionsHelper->deleteTransient('lastBundleUpdate');
            }
        }

        return ['status' => true];
    }
}
