<?php

namespace VisualComposer\Modules\Hub\Download\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Page;

class UpdateBePage extends Container implements Module
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-update';

    /**
     * @var string
     */
    protected $templatePath = 'hub/updating-layout';

    public function __construct(Token $tokenHelper)
    {
        $this->addEvent(
            'vcv:inited',
            function (Options $optionsHelper, Request $requestHelper, Token $tokenHelper) {
                if ($tokenHelper->isSiteAuthorized() && $optionsHelper->get('bundleUpdateRequired')) {
                    $this->addFilter(
                        'vcv:settings:getPages',
                        'addPage',
                        40
                    );
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    $aboutPage = vcapp('SettingsPagesAbout');
                    wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
                    exit;
                }
            }
        );
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD') && $tokenHelper->isSiteAuthorized()) {
            $this->addFilter(
                'vcv:editors:backend:addMetabox',
                'setRedirectToUpdateBe',
                120
            );
            $this->addFilter('vcv:editors:backend:addMetabox', 'doRedirectBe', 130);
        }
    }

    /**
     *
     */
    protected function beforeRender()
    {
        wp_dequeue_script('vcv:settings:script');
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return $pages;
        }
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Update', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function setRedirectToUpdateBe($response, $payload, Options $optionsHelper, Url $urlHelper)
    {
        if ($optionsHelper->get('bundleUpdateRequired')) {
            $optionsHelper->setTransient('_vcv_update_page_redirect', 1, 30);
            $optionsHelper->setTransient('_vcv_update_page_redirect_url', $urlHelper->current(), 30);
        }

        return $response;
    }

    /**
     * Do redirect if required on welcome page
     *
     * @param $response
     * @param UpdateBePage $updateBePage
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return
     */
    protected function doRedirectBe($response, UpdateBePage $updateBePage, Options $optionsHelper)
    {
        $redirect = $optionsHelper->getTransient('_vcv_update_page_redirect');
        $optionsHelper->deleteTransient('_vcv_update_page_redirect');
        if ($redirect) {
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($updateBePage->getSlug())));
        }

        return $response;
    }
}
