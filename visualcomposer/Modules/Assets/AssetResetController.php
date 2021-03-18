<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Application;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class AssetResetController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $cache = [];

    protected $changed = false;

    protected $fileHelper = false;

    public function __construct(File $fileHelper)
    {
        $this->fileHelper = $fileHelper;

        // Run always on reset
        $this->addEvent(
            'vcv:system:factory:reset',
            function () {
                /** @see \VisualComposer\Modules\Assets\AssetResetController::updateCssFiles */
                $this->call('updateCssFiles');
            },
            100
        );

        // Check on every page load
        $this->wpAddAction(
            'template_redirect',
            function () {
                $post = get_post();
                if ($post) {
                    $this->call('checkForReset', [$post]);
                }
            },
            100
        );

        // For templates/inner content
        $this->addEvent(
            'vcv:frontend:renderContent',
            function ($postId) {
                $post = get_post($postId);
                if ($post) {
                    $this->call('checkForReset', [$post]);
                }
            }
        );
    }

    protected function checkForReset($post, Options $optionsHelper)
    {
        $postSourceCssResetInitiated = get_post_meta(
            $post->ID,
            '_' . VCV_PREFIX . 'postAssetResetResetInitiated',
            true
        );
        $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');
        $isResetInitiated = $settingsResetInitiated
            && $settingsResetInitiated >= $postSourceCssResetInitiated
            //@codingStandardsIgnoreLine
            && $settingsResetInitiated >= strtotime($post->post_date);
        if ($isResetInitiated) {
            /** @see \VisualComposer\Modules\Assets\AssetResetController::updatePosts */
            $this->call('updatePosts', [$post->ID]);
            update_post_meta($post->ID, '_' . VCV_PREFIX . 'postAssetResetResetInitiated', time());
        }
    }

    protected function updateCssFiles(Assets $assetsHelper)
    {
        $status = false;
        $destinationDir = $assetsHelper->getFilePath();

        /** @var Application $app */
        $app = vcapp();
        $files = $app->glob(rtrim($destinationDir, '/\\') . '/*.css');
        if (is_array($files)) {
            foreach ($files as $file) {
                $content = $this->fileHelper->getContents($file);
                if (!empty($content)) {
                    // extract all links
                    $content = $this->findLinks($content);
                    if ($this->changed) {
                        $this->fileHelper->setContents($file, $content);
                    }
                }
            }
            unset($file);
        }

        return $status;
    }

    protected function updatePosts($postId)
    {
        $this->updatePageElementsCssData($postId);
        $this->updatePageContent($postId);
        $this->updatePostContent($postId);
    }

    /**
     * @param $content
     *
     * @return null|string|string[]
     */
    protected function findLinks($content, $sourceId = '')
    {
        if (!empty($content)) {
            $replacedContent = preg_replace_callback(
                '/(http|https)\:\/\/([a-zA-Z0-9\-\.:]+)(\/\S[^.]*)+(\.[a-zA-Z0-9]{2,4})/',
                function ($link) use ($sourceId) {
                    return $this->parseLink($link, $sourceId);
                },
                $content
            );

            $content = apply_filters(
                'vcv:api:migration:replaceContent',
                $replacedContent ? $replacedContent : $content,
                $this,
                $sourceId
            );
        }

        return $content;
    }

    public function setChanged($changed = true)
    {
        $this->changed = $changed;
    }

    protected function parseLink($link, $sourceId)
    {
        if (array_key_exists($link[0], $this->cache)) {
            return $this->cache[ $link[0] ];
        }
        $contentDirPattern = str_replace(
            '/',
            '\\/',
            str_replace(ABSPATH, '', WP_CONTENT_DIR)
        );
        $relative = preg_replace('/^(.*)?\/' . $contentDirPattern . '\//', '', $link[3] . $link[4]);
        $path = rtrim(WP_CONTENT_DIR, '/\\') . '/' . ltrim($relative, '/\\');
        if ($this->fileHelper->isFile($path)) {
            $this->changed = true;
            $updatedLink = set_url_scheme(WP_CONTENT_URL . '/' . $relative);
            $this->cache[ $link[0] ] = $updatedLink;

            return $updatedLink;
        }
        $updatedLink = apply_filters('vcv:api:migration:link', $link[0], $sourceId);
        $this->cache[ $link[0] ] = $updatedLink;

        return $updatedLink;
    }

    /**
     * @param $postId
     */
    protected function updatePageContent($postId)
    {
        $pageContent = get_post_meta($postId, VCV_PREFIX . 'pageContent', true);
        if (!empty($pageContent)) {
            $this->changed = false;
            $parsedPageContent = rawurldecode($pageContent);
            $decodedPageContent = json_decode($parsedPageContent, true);
            if (is_array($decodedPageContent)) {
                array_walk_recursive(
                    $decodedPageContent,
                    function (&$value, $key) use ($postId) {
                        $value = $this->call(
                            'findLinks',
                            [
                                'content' => $value,
                                'sourceId' => $postId,
                            ]
                        );
                    }
                );
                if ($this->changed) {
                    $encodedPageContent = wp_json_encode($decodedPageContent);
                    $encodedPageContent = rawurlencode($encodedPageContent);
                    update_post_meta($postId, VCV_PREFIX . 'pageContent', $encodedPageContent);
                }
            }
        }
    }

    /**
     * @param $postId
     */
    protected function updatePostContent($postId)
    {
        $post = get_post($postId);
        //@codingStandardsIgnoreLine
        $postContent = $post->post_content;
        if (!empty($postContent)) {
            $this->changed = false;
            $postContent = $this->findLinks($postContent, $postId);
            if ($this->changed) {
                //@codingStandardsIgnoreLine
                $post->post_content = $postContent;
                wp_update_post($post);
            }
        }
    }

    /**
     * @param $postId
     */
    protected function updatePageElementsCssData($postId)
    {
        $globalElementsCssData = get_post_meta($postId, VCV_PREFIX . 'globalElementsCssData', true);
        if (is_array($globalElementsCssData)) {
            $this->changed = false;
            array_walk_recursive(
                $globalElementsCssData,
                function (&$value, $key) use ($postId) {
                    $value = $this->call(
                        'findLinks',
                        [
                            'content' => $value,
                            'sourceId' => $postId,
                        ]
                    );
                }
            );
            if ($this->changed) {
                // update_post_meta
                update_post_meta($postId, VCV_PREFIX . 'globalElementsCssData', $globalElementsCssData);
            }
        }
    }
}
