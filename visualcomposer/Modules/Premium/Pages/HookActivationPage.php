<?php

namespace VisualComposer\Modules\Premium\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Data;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Account\Pages\ActivationPage;

class HookActivationPage extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_LICENSES')) {
            $this->addEvent(
                'vcv:inited',
                function (Token $tokenHelper, Request $requestHelper, License $licenseHelper) {
                    if (!$tokenHelper->isSiteAuthorized() && $licenseHelper->isActivated()) {
                        /** @see \VisualComposer\Modules\Account\Pages\HookActivationPage::hookAddPage */
                        $this->addFilter(
                            'vcv:settings:getPages',
                            'hookAddPage',
                            41
                        );
                    }
                }
            );
            /** @see \VisualComposer\Modules\Account\Pages\HookActivationPage::getActivationActivePage */
            $this->addFilter('vcv:account:activation:activePage', 'getActivationActivePage');
        }
    }

    protected function hookAddPage($response, Data $dataHelper, ActivationPage $activationPageModule)
    {
        if (is_array($response)) {
            $index = $dataHelper->arraySearch($response, 'slug', $activationPageModule->getSlug(), true);
            if ($index !== false) {
                $type = $response[ $index ]['type'];
                if ($type === 'default') {
                    $response[ $index ]['type'] = 'premium';
                }
            }
        }

        return $response;
    }

    protected function getActivationActivePage()
    {
        $licenseHelper = vchelper('License');

        if ($licenseHelper->isActivated()) {
            return 'download';
        } else {
            return 'intro';
        }
    }
}
