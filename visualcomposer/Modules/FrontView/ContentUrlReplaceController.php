<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class ContentUrlReplaceController
 * @package VisualComposer\Modules\FrontView
 */
class ContentUrlReplaceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Stores temporary str_replace replaced values count
     * @var int
     */
    protected $replaceCount = 0;

    /**
     * AssetUrlReplaceController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\FrontView\ContentUrlReplaceController::registerSiteCurrentUrl */
        $this->addEvent('vcv:inited', 'registerSiteCurrentUrl');
        /** @see \VisualComposer\Modules\FrontView\ContentUrlReplaceController::replaceMetaUrls */
        $this->addFilter('vcv:ajax:getData:adminNonce', 'replaceMetaUrls', 9);
        /** @see \VisualComposer\Modules\FrontView\ContentUrlReplaceController::replaceContentUrls */
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'replaceContentUrls', 100);
    }

    /**
     * Store the current site url if it has been changed since last time, also store the old url
     */
    protected function registerSiteCurrentUrl()
    {
        $optionsHelper = vchelper('Options');
        $currentSiteUrl = get_site_url();
        $wrongUrls = ['https:', 'http:', 'http://', 'https://'];
        if (!$currentSiteUrl || in_array($currentSiteUrl, $wrongUrls, true)) {
            // We got wrong get_site_url() (support #18071)
            return;
        }
        $currentSiteUrl = rtrim($currentSiteUrl, '/\\');
        $siteUrls = $optionsHelper->get('siteUrls');
        if (!$siteUrls || !is_array($siteUrls)) {
            $siteUrls = ['prevUrls' => [], 'currentUrl' => $currentSiteUrl];
            $optionsHelper->set('siteUrls', ['prevUrls' => [], 'currentUrl' => $currentSiteUrl]);
        }

        if ($siteUrls['currentUrl'] !== $currentSiteUrl) {
            if (!empty($siteUrls['currentUrl'])) {
                $siteUrls['prevUrls'][] = $siteUrls['currentUrl'];
            }
            $optionsHelper->set(
                'siteUrls',
                [
                    'prevUrls' => $this->clearWrongUrls($siteUrls['prevUrls']),
                    'currentUrl' => $currentSiteUrl,
                ]
            );
        }

        // If currentSiteUrl exists in previous urls, remove them
        $prevUrls = array_unique($siteUrls['prevUrls']);
        $siteKey = array_search($currentSiteUrl, $prevUrls, true);
        if ($siteKey !== false) {
            unset($prevUrls[ $siteKey ]);
            $optionsHelper->set(
                'siteUrls',
                ['prevUrls' => $this->clearWrongUrls($prevUrls), 'currentUrl' => $currentSiteUrl]
            );
        }
    }

    protected function replaceMetaUrls($response, Options $optionsHelper)
    {
        $sourceId = get_the_ID();
        $post = get_post($sourceId);
        if (!empty($post)) {
            $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');
            $postMetaResetInitiated = get_post_meta(
                $sourceId,
                '_' . VCV_PREFIX . 'postMetaResetInitiated',
                true
            );
            $isResetInitiated = $settingsResetInitiated
                && $settingsResetInitiated >= $postMetaResetInitiated
                //@codingStandardsIgnoreLine
                && $settingsResetInitiated >= strtotime($post->post_date);
            if ($isResetInitiated) {
                $siteUrls = $optionsHelper->get('siteUrls');
                if (!is_array($siteUrls)) {
                    return $response;
                }
                $this->replaceMetaPageElementsCssData($sourceId, $siteUrls);
                $response = $this->replaceMetaPageContent($response, $sourceId, $siteUrls);
                update_post_meta($post->ID, '_' . VCV_PREFIX . 'postMetaResetInitiated', time());
            }
        }

        return $response;
    }

    protected function replaceContentUrls($content, Options $optionsHelper, Frontend $frontendHelper)
    {
        $sourceId = get_the_ID();
        $post = get_post($sourceId);
        if (!empty($post)) {
            $postContentResetInitiated = get_post_meta(
                $sourceId,
                '_' . VCV_PREFIX . 'postContentResetInitiated',
                true
            );
            $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');
            $isResetInitiated = $settingsResetInitiated
                && $settingsResetInitiated >= $postContentResetInitiated
                //@codingStandardsIgnoreLine
                && $settingsResetInitiated >= strtotime($post->post_date);
            if (!$frontendHelper->isPageEditable() && $isResetInitiated) {
                $pageContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
                //@codingStandardsIgnoreLine
                if ($pageContent && !empty($post->post_content)) {
                    $siteUrls = $optionsHelper->get('siteUrls');
                    $siteUrls['currentUrl'] = rtrim($siteUrls['currentUrl'], '/\\');
                    if (!is_array($siteUrls)) {
                        return $content;
                    }
                    $this->replaceCount = 0;
                    //@codingStandardsIgnoreLine
                    $post->post_content = str_replace(
                        $this->clearWrongUrls($siteUrls['prevUrls']),
                        $siteUrls['currentUrl'],
                        //@codingStandardsIgnoreLine
                        $post->post_content,
                        $this->replaceCount
                    );
                    if ($this->replaceCount > 0) {
                        wp_update_post($post);
                        //@codingStandardsIgnoreLine
                        $content = $post->post_content;
                    }
                    update_post_meta($post->ID, '_' . VCV_PREFIX . 'postContentResetInitiated', time());
                }
            }
        }

        return $content;
    }

    /**
     * @param $response
     * @param $sourceId
     * @param $siteUrls
     *
     * @return array
     */
    protected function replaceMetaPageContent($response, $sourceId, $siteUrls)
    {
        $pageContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        $parsedPageContent = rawurldecode($pageContent);
        $decodedPageContent = json_decode($parsedPageContent, true);
        if (is_array($decodedPageContent) && !empty($siteUrls['prevUrls'])) {
            $this->replaceCount = 0;
            array_walk_recursive(
                $decodedPageContent,
                function (&$value, $key) use ($siteUrls) {
                    $replaceCount = 0;
                    $value = str_replace(
                        $this->clearWrongUrls($siteUrls['prevUrls']),
                        $siteUrls['currentUrl'],
                        $value,
                        $replaceCount
                    );
                    if ($replaceCount > 0) {
                        $this->replaceCount++;
                    }
                }
            );
            if ($this->replaceCount > 0) {
                $encodedPageContent = wp_json_encode($decodedPageContent);
                $encodedPageContent = rawurlencode($encodedPageContent);
                update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $encodedPageContent);
                $response['data'] = $encodedPageContent;
            }
        }

        return $response;
    }

    protected function clearWrongUrls($urls)
    {
        $callback = function ($url) {
            return !(empty($url) || in_array($url, ['https:', 'http:', 'http://', 'https://'], true));
        };


        return array_map([$this,'removeTrailingSlash'], array_values(array_unique(array_filter($urls, $callback))));
    }

    protected function removeTrailingSlash($url)
    {
        return rtrim($url, '/\\');
    }

    /**
     * @param $sourceId
     * @param $siteUrls
     *
     * @return array|mixed
     */
    protected function replaceMetaPageElementsCssData($sourceId, $siteUrls)
    {
        $globalElementsCssData = get_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', true);
        if (is_array($globalElementsCssData)) {
            $this->replaceCount = 0;
            array_walk_recursive(
                $globalElementsCssData,
                function (&$value, $key) use ($siteUrls) {
                    $replaceCount = 0;
                    $value = str_replace(
                        $this->clearWrongUrls($siteUrls['prevUrls']),
                        $siteUrls['currentUrl'],
                        $value,
                        $replaceCount
                    );
                    if ($replaceCount > 0) {
                        $this->replaceCount++;
                    }
                }
            );
            if ($this->replaceCount > 0) {
                update_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', $globalElementsCssData);
            }
        }

        return $globalElementsCssData;
    }
}
