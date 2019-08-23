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
use VisualComposer\Helpers\Traits\EventsFilters;
use WP_Query;

class AssetResetController extends Container implements Module
{
    use EventsFilters;

    protected $cache = [];

    protected $changed = false;

    protected $fileHelper = false;

    public function __construct()
    {
        if (vcvenv('VCV_TF_ASSETS_URLS_FACTORY_RESET')) {
            $this->addEvent(
                'vcv:system:factory:reset',
                function (File $fileHelper) {
                    $this->fileHelper = $fileHelper;
                    $this->call('updateCssFiles');
                    $this->call('updatePosts');
                },
                100
            );
        }
    }

    protected function updateCssFiles(Assets $assetsHelper, File $fileHelper)
    {
        $status = false;
        $destinationDir = $assetsHelper->getFilePath();

        /** @var Application $app */
        $app = vcapp();
        $files = $app->glob(rtrim($destinationDir, '/\\') . '/*.css');
        if (is_array($files)) {
            foreach ($files as $file) {
                $content = $fileHelper->getContents($file);
                if (!empty($content)) {
                    // extract all links
                    $content = $this->findLinks($content);
                    if ($this->changed) {
                        $fileHelper->setContents($file, $content);
                    }
                }
            }
            unset($file);
        }

        return $status;
    }

    protected function updatePosts()
    {
        $vcvPosts = new WP_Query(
            [
                'post_type' => 'any',
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private'],
                'posts_per_page' => -1,
                'meta_key' => VCV_PREFIX . 'pageContent',
                'suppress_filters' => true,
            ]
        );

        while ($vcvPosts->have_posts()) {
            $vcvPosts->the_post();
            $postId = get_the_ID();
            $this->updatePageElementsCssData($postId);
            $this->updatePageContent($postId);
            $this->updatePostContent($postId);
        }
        wp_reset_postdata();
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

            $content = apply_filters('vc_migration_replace_content', $replacedContent ? $replacedContent : $content, $this, $sourceId);
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
            return $this->cache[$link[0]];
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
            $this->cache[$link[0]] = $updatedLink;

            return $updatedLink;
        }
        $updatedLink = apply_filters('vc_migration_link', $link[0], $sourceId);
        $this->cache[$link[0]] = $updatedLink;

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
                        $value = $this->call('findLinks', [
                            'content' => $value,
                            'sourceId' => $postId,
                        ]);
                    }
                );
                if ($this->changed) {
                    $encodedPageContent = json_encode($decodedPageContent);
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
                    $value = $this->call('findLinks', [
                        'content' => $value,
                        'sourceId' => $postId
                    ]);
                }
            );
            if ($this->changed) {
                // update_post_meta
                update_post_meta($postId, VCV_PREFIX . 'globalElementsCssData', $globalElementsCssData);
            }
        }
    }
}
