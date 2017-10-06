<?php

namespace VisualComposer\Modules\Hub\Download;

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

class AuthorizedUpdateController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_LICENSES') && vcvenv('VCV_ENV_UPGRADE')) {
            /** @see \VisualComposer\Modules\Hub\Download\AuthorizedUpdateController::checkRemoteToken */
            $this->addFilter('vcv:ajax:hub:download:json:token:adminNonce', 'checkRemoteToken');
        }
    }

    /**
     * @param Request $requestHelper
     * @param License $licenseHelper
     * @param Token $tokenHelper
     * @param Options $optionsHelper
     */
    protected function checkRemoteToken(Request $requestHelper, License $licenseHelper, Token $tokenHelper, Options $optionsHelper)
    {
        if ($licenseHelper->isActivated()) {
            $tokenHelper->setToken($requestHelper->input('token'));
        }

        // Do redirect @todo
        $redirectUrl = $optionsHelper->getTransient('!!!!');
        die;
    }
}
