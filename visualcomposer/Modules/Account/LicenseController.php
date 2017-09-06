<?php

namespace VisualComposer\Modules\Account;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Account\Pages\ActivationPage;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\Account
 */
class LicenseController extends Container/* implements Module*/
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-update-to-premium';

    /**
     * LicenseController constructor.
     */
    public function __construct()
    {
        $this->addEvent(
            'vcv:inited',
            function (
                Request $requestHelper,
                CurrentUser $currentUserHelper,
                License $licenseHelper,
                ActivationPage $activationPageModule
            ) {
                if (!$currentUserHelper->wpAll('manage_options')->get()) {
                    return;
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(
                        VCV_ACTIVATE_LICENSE_URL .
                        '/?redirect=' . admin_url('admin.php?page=' . rawurlencode($activationPageModule->getSlug())) .
                        '&token=' . rawurlencode($licenseHelper->newKeyToken()) .
                        '&url=' . VCV_PLUGIN_URL
                    );
                    exit;
                }
            }
        );

        $this->addEvent(
            'vcv:inited',
            function (Request $requestHelper, CurrentUser $currentUserHelper, License $licenseHelper) {
                if (!$currentUserHelper->wpAll('manage_options')->get()) {
                    return;
                } elseif ($requestHelper->input('activate')) {
                    $token = $requestHelper->input('activate');
                    if ($licenseHelper->isValidToken($token)) {
                        $result = wp_remote_get(
                            VCV_ACTIVATE_LICENSE_FINISH_URL,
                            [
                                'timeout' => 10,
                                'body' => [
                                    'token' => rawurlencode($requestHelper->input('activation')),
                                ],
                            ]
                        );

                        if (!vcIsBadResponse($result)) {
                            $result = json_decode($result['body'], true);
                            $licenseHelper->setKey($result['license_key']);
                        }
                    } else {
                        return false;
                        //TODO: Add log
                    }
                }
            }
        );
    }
}
