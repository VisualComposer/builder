<?php

namespace singleImage\singleImage;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class ResizeController extends Container implements Module
{
    use EventsFilters;
    use AddShortcodeTrait;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addFilter('setData:updatePostData:content vcv:templates:create:content', 'parseContent');
    }

    protected function parseContent($content)
    {
        $parsedContent = preg_replace_callback(
            '/\[vcvSingleImage (.*?)\]/si',
            function ($matches) {
                return $this->call('parseImage', ['matches' => $matches]);
            },
            $content
        );

        return $parsedContent;
    }

    protected function parseImage($matches)
    {
        if (isset($matches[1])) {
            preg_match('(\ssrc=["|\'](.*?)["|\'])', $matches[1], $matchesUrl);
            if (isset($matchesUrl[1])) {
                $src = $matchesUrl[1];
            }

            preg_match('(data-height=["|\']([0-9]{0,4})["|\'])', $matches[1], $matchesHeight);
            if (isset($matchesHeight[1])) {
                $height = $matchesHeight[1];
            }

            preg_match('(data-width=["|\']([0-9]{0,4})["|\'])', $matches[1], $matchesWidth);
            if (isset($matchesWidth[1])) {
                $width = $matchesWidth[1];
            }

            $dynamic = false;
            if (vcvenv('VCV_JS_FT_DYNAMIC_FIELDS')) {
                // TODO: Change key featured to more specific like featured_image
                $isMatches = preg_match('(dynamic="featured")', $matches[1], $matchesDynamic);
                if ($isMatches) {
                    $dynamic = 'featured';
                }
            }

            if (isset($src) && isset($width) && isset($height)) {
                return $this->generateImage($matches, $src, $width, $height, $dynamic);
            }
        }

        return $matches[0];
    }

    protected function getImageData($url)
    {
        $contentUrl = content_url();
        $contentUrl = str_replace(['http://', 'https://'], '', $contentUrl);
        if (strpos($url, $contentUrl) !== false) {
            $path = str_replace(['http://', 'https://'], '', $url);
            $path = str_replace($contentUrl, basename($contentUrl), $path);
        } else {
            $path = wp_make_link_relative($url);
        }

        $pathinfo = pathinfo($path);

        $imageData = [
            'path' => rtrim(ABSPATH, '/\\') . '/' . ltrim($path, '/\\'),
            'filename' => $pathinfo['filename'],
            'extension' => $pathinfo['extension'],
        ];

        return $imageData;
    }

    /**
     * @param $content
     * @param $src
     * @param bool $width
     * @param bool $height
     *
     * @param bool $dynamic
     *
     * @return string
     */
    protected function generateImage($content, $src, $width = false, $height = false, $dynamic = false)
    {
        $imageData = $this->getImageData($src);
        $image = wp_get_image_editor($imageData['path']);
        if (!is_wp_error($image) && $width && $height) {
            $image->resize($width, $height, true);

            $uploadDir = wp_upload_dir();
            $newPath = $uploadDir['path'] . '/' . $imageData['filename'] . '-' . $width . 'x' . $height
                . '.' . $imageData['extension'];
            $newfile = $image->save($newPath);

            if (file_exists($uploadDir['path'] . '/' . $newfile['file'])) {
                $src = $uploadDir['url'] . '/' . $newfile['file'];
            }
        }

        $newSrc = ' src="' . set_url_scheme($src) . '"';

        $attributes = preg_replace('(\ssrc=["|\'](.*?)["|\'])', $newSrc, $content[1]);
        $attributes = preg_replace('(data-default-image=["|\'](true|false)["|\'])', '', $attributes);

        if ($dynamic) {
            return '<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ' . json_encode(
                    ['type' => 'post', 'value' => 'featured', 'atts' => urlencode($attributes)]
                ) . ' -->';
        }

        return '<img ' . $attributes . '/>';
    }
}
