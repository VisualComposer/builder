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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\Account
 */
class LicenseController extends Container implements Module
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
            function (Request $requestHelper, CurrentUser $currentUserHelper) {
                if (!$currentUserHelper->wpAll('manage_options')->get()) {
                    return;
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    $settingsPage = vcapp('SettingsPagesSettings');
                    wp_redirect(
                        VCV_ACCOUNT_URL . '/login/?vcv-redirect=' . admin_url(
                            'admin.php?page=' . rawurlencode($settingsPage->getSlug())
                        )
                    );
                    exit;
                }
            }
        );
    }
}
