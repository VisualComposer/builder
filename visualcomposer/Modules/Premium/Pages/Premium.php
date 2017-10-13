<?php

namespace VisualComposer\Modules\Premium\Pages;

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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Pages\About;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Premium.
 */
class Premium extends Container implements Module
{
    use Page;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-upgrade';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    /**
     * Premium constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(Token $tokenHelper, License $licenseHelper, Request $requestHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID')) {
            /** @see \VisualComposer\Modules\Premium\Pages\Premium::addPage */
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
        /** @see \VisualComposer\Modules\Premium\Pages\Premium::unsetOptions */
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
            'type' => 'premium',
        ];

        return $pages;
    }

    /**
     *
     */
    protected function beforeRender()
    {
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
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
