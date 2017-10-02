<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Premium.
 */
class Premium extends About implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-upgrade';

    /**
     * Premium constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(Token $tokenHelper, License $licenseHelper, Request $requestHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID')) {
            /** @see \VisualComposer\Modules\Settings\Pages\Premium::addPage */
            if ($requestHelper->input('page') === $this->getSlug()) {
                $this->addEvent('vcv:inited', 'beforePageRender');
            }
            if (($tokenHelper->isSiteAuthorized() && !$licenseHelper->getKey())
                ||
                ($licenseHelper->getKey() && $licenseHelper->getKeyToken())
            ) {
                $this->addFilter(
                    'vcv:settings:getPages',
                    'addPage',
                    70
                );
            }
        }
        /** @see \VisualComposer\Modules\Settings\Pages\Premium::unsetOptions */
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function redirectToAbout(About $aboutPageModule)
    {
        wp_redirect(admin_url('admin.php?page=' . $aboutPageModule->getSlug()));
        exit;
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Go Premium', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'hidePage' => true,
            'controller' => $this,
            'capability' => 'manage_options',
            'type' => 'premium'
        ];

        return $pages;
    }

    protected function beforePageRender()
    {
        if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
            return;
        }
        $licenseHelper = vchelper('License');
        if (!$licenseHelper->getKey() && vcvenv('VCV_ENV_UPGRADE')) {
            $licenseHelper->activateInAccount();
            exit;
        } elseif (!$licenseHelper->getKeyToken() || !vcvenv('VCV_ENV_UPGRADE')) {
            $this->call('redirectToAbout');
        }
    }

    public function getActivePage()
    {
        return 'download';
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
    }
}
