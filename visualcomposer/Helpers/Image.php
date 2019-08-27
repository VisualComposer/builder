<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Image implements Helper
{
    public function parseImage($matches)
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
                $isMatches = preg_match('(\sdata-dynamic=["|\'](.*?)["|\'])', $matches[1], $matchesDynamic);
                if ($isMatches) {
                    $dynamic = $matchesDynamic[1];
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
        $srcset = [];
        if (!$dynamic && !is_wp_error($image) && $width && $height) {
            $image->resize($width, $height, true);

            $uploadDir = wp_upload_dir();
            $newPath = $uploadDir['path'] . '/' . $imageData['filename'] . '-' . $width . 'x' . $height
                . '.' . $imageData['extension'];
            $newfile = $image->save($newPath);

            if (file_exists($uploadDir['path'] . '/' . $newfile['file'])) {
                $src = $uploadDir['url'] . '/' . $newfile['file'];
            }

            $originalWidth = $width;
            $sizes = [320, 480, 800, (int)$originalWidth];
            $aspectRatio = $originalWidth / $height;

            foreach ($sizes as $width) {
                if ($width > $originalWidth) {
                    continue;
                }
                $image = wp_get_image_editor($imageData['path']);
                $height = round($width / $aspectRatio);
                $image->resize($width, $height, true);

                $uploadDir = wp_upload_dir();
                $newPath = $uploadDir['path'] . '/' . $imageData['filename'] . '-' . $width . 'x' . $height
                    . '.' . $imageData['extension'];
                $newfile = $image->save($newPath);

                array_push($srcset, $uploadDir['url'] . '/' . $newfile['file'] . ' ' . $width . 'w');
            }
        }

        $newSrc = 'src="' . set_url_scheme($src) . '"';
        if (!empty($srcset) && !$dynamic) {
            $newSrc .= ' srcset="' . implode(',', $srcset) . '"';
        }

        $attributes = preg_replace('(\ssrc=["|\'](.*?)["|\'])', $newSrc, $content[1]);
        $attributes = preg_replace('(data-default-image=["|\'](true|false)["|\'])', '', $attributes);
        if (!$dynamic) {
            $attributes = str_replace(['data-height', 'data-width'], ['height', 'width'], $attributes);
        }
        $result = '';
        if ($dynamic) {
            $blockAttributes = wp_json_encode(
                [
                    'type' => get_post_type(),
                    'value' => $dynamic,
                    'atts' => urlencode($attributes),
                ]
            );
            $result .= '<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ' . $blockAttributes . ' -->';
        }

        $result .= '<img ' . $attributes . '/>';

        if ($dynamic) {
            $result .= '<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->';
        }

        return $result;
    }
}
