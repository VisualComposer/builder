<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\License
 */
class LicenseController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * LicenseController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:ajax:license:activate:adminNonce', 'getLicenseKey');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Receive licence key and store it in DB
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param Token $tokenHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function getLicenseKey(
        $response,
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Notice $noticeHelper,
        Token $tokenHelper,
        Options $optionsHelper
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return $response;
        }

        if ($requestHelper->input('activate')) {
            $token = $requestHelper->input('activate');
            if ($licenseHelper->isValidToken($token)) {
                if ($requestHelper->exists('type') && $requestHelper->input('type') === 'free') {
                    $tokenHelper->setSiteAuthorized();
                    $optionsHelper->deleteTransient('lastBundleUpdate');
                    wp_redirect(admin_url('admin.php?page=vcv-update'));
                    exit;
                }
            } else {
                $noticeHelper->addNotice(
                    'activation:failed',
                    // TODO: Error texts
                    __('Invalid token -> Failed licence activation - Invalid token', 'visualcomposer')
                );
            }
        }

        wp_redirect(admin_url('index.php'));
        exit;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('license-key-token')
            ->delete('license-key');
    }
}
