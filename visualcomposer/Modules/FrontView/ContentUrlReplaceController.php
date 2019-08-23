<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class AssetUrlReplaceController
 * @package VisualComposer\Modules\FrontView
 */
class ContentUrlReplaceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $changed = false;

    /**
     * AssetUrlReplaceController constructor.
     */
    public function __construct()
    {
        $this->addEvent('vcv:inited', 'registerSiteCurrentUrl');
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'replaceContentUrls', 100);
        $this->addFilter('vcv:ajax:getData:adminNonce', 'replaceMetaUrls', 9);
    }

    /**
     * Store the current site url if it has been changed since last time, also store the old url
     */
    protected function registerSiteCurrentUrl()
    {
        $optionsHelper = vchelper('Options');
        $siteUrls = $optionsHelper->get('siteUrls', ['prevUrls' => [], 'currentUrl' => '']);
        $siteUrl = get_site_url();
        if (!$siteUrls || $siteUrls['currentUrl'] !== $siteUrl) {
            if (isset($siteUrls['currentUrl']) && $siteUrls['currentUrl'] !== $siteUrl) {
                $siteUrls['prevUrls'][] = $siteUrls['currentUrl'];
                $optionsHelper->set(
                    'siteUrls',
                    [
                        'prevUrls' => $siteUrls['prevUrls'],
                        'currentUrl' => $siteUrl,
                    ]
                );
            } else {
                $optionsHelper->set('siteUrls', ['prevUrls' => [], 'currentUrl' => $siteUrl]);
            }
        }

        $siteKey = array_search($siteUrl, $siteUrls['prevUrls']);
        if (false !== $siteKey) {
            unset($siteUrls['prevUrls'][ $siteKey ]);
            $optionsHelper->set('siteUrls', ['prevUrls' => $siteUrls['prevUrls'], 'currentUrl' => $siteUrl]);
        }
    }

    protected function replaceMetaUrls($content)
    {
        $optionsHelper = vchelper('Options');
        $sourceId = get_the_ID();
        $post = get_post($sourceId);
        $this->changed = false;

        $pageContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        $parsedPageContent = rawurldecode($pageContent);
        $decodedPageContent = json_decode($parsedPageContent, true);

        $siteUrls = $optionsHelper->get('siteUrls');
        $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');

        $postSettingsResetInitiated = get_post_meta($sourceId, '_' . VCV_PREFIX . 'postSettingsResetInitiated', true);
        $pageContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        //@codingStandardsIgnoreLine
        if (isset($post) && $pageContent && $settingsResetInitiated && $settingsResetInitiated >= $postSettingsResetInitiated && $settingsResetInitiated >= strtotime($post->post_date)) {
            if (is_array($decodedPageContent) && !empty($siteUrls['prevUrls'])) {
                array_walk_recursive(
                    $decodedPageContent,
                    function (&$value, $key) use ($siteUrls) {
                        $value = str_replace($siteUrls['prevUrls'], $siteUrls['currentUrl'], $value);
                        $this->changed = true;
                    }
                );

                $encodedPageContent = json_encode($decodedPageContent);
                $encodedPageContent = rawurlencode($encodedPageContent);
                $content['data'] = $encodedPageContent;
                update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $encodedPageContent);
                update_post_meta($post->ID, '_' . VCV_PREFIX . 'postSettingsResetInitiated', time());
            }
        }

        return $content;
    }

    protected function replaceContentUrls($content)
    {
        $optionsHelper = vchelper('Options');
        $frontendHelper = vchelper('Frontend');
        $sourceId = get_the_ID();
        $this->changed = false;

        $post = get_post($sourceId);
        $postSettingsResetInitiated = get_post_meta($sourceId, '_' . VCV_PREFIX . 'postSettingsResetInitiated', true);
        $pageContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);

        $siteUrls = $optionsHelper->get('siteUrls');
        $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');

        //@codingStandardsIgnoreLine
        if (!$frontendHelper->isPageEditable() && isset($post) && $pageContent && $settingsResetInitiated && $settingsResetInitiated >= $postSettingsResetInitiated && $settingsResetInitiated >= strtotime($post->post_date)) {
            //@codingStandardsIgnoreLine
            if ($pageContent && isset($post->post_content)) {
                array_walk_recursive(
                    $post,
                    function (&$value, $key) use ($siteUrls, $post) {
                        if ($key === 'post_content') {
                            //@codingStandardsIgnoreLine
                            $post->post_content = str_replace($siteUrls['prevUrls'], $siteUrls['currentUrl'], $value);
                        }
                    }
                );
                //@codingStandardsIgnoreLine
                $content = $post->post_content;
                wp_update_post($post);
                update_post_meta($post->ID, '_' . VCV_PREFIX . 'postSettingsResetInitiated', time());
            }
        }

        return $content;
    }
}
