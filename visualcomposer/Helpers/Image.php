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
                $height = (int)$matchesHeight[1];
            }

            preg_match('(data-width=["|\']([0-9]{0,4})["|\'])', $matches[1], $matchesWidth);
            if (isset($matchesWidth[1])) {
                $width = (int)$matchesWidth[1];
            }

            $dynamic = false;
            if (vcvenv('VCV_JS_FT_DYNAMIC_FIELDS')) {
                $isMatches = preg_match('(\sdata-dynamic=["|\'](.*?)["|\'])', $matches[1], $matchesDynamic);
                if ($isMatches) {
                    $dynamic = $matchesDynamic[1];
                }
            }

            $attachmentId = 0;
            preg_match('(data-attachment-id=["|\'](\d+)["|\'])', $matches[1], $matchesAttachmentId);
            if (isset($matchesAttachmentId[1])) {
                $attachmentId = (int)$matchesAttachmentId[1];
            }

            if (isset($src, $width, $height)) {
                return $this->generateImage($matches, $src, $width, $height, $dynamic, $attachmentId);
            }
        }

        return $matches[0];
    }

    public function getImageData($url)
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
     * Generate <img> with provided attributes
     *
     * @param array $content
     * @param string $src
     * @param int|bool $width
     * @param int|bool $height
     * @param bool $dynamic
     * @param int $attachmentId
     *
     * @return string
     */
    protected function generateImage($content, $src, $width = false, $height = false, $dynamic = false, $attachmentId = 0)
    {
        $src = $this->getLazyLoadSrc($content[1], $src);
        $imageData = $this->getImageData($src);

        // Add some additional data for the image
        $imageData['width'] = $width;
        $imageData['height'] = $height;
        $imageData['attachmentId'] = $attachmentId;

        $image = wp_get_image_editor($imageData['path']);

        $newSrc = '';
        if (!$dynamic && $width && $height && !is_wp_error($image)) {
            $originalSize = $image->get_size();
            $imageData['originalWidth'] = $originalSize['width'];
            $imageData['originalHeight'] = $originalSize['height'];

            $sizes = $this->getSizes($imageData);
            $images = $this->getImages($sizes, $image, $imageData);

            // Update the src with a resized image (with provided $width and $height).
            // Should be already in a list of $images, as we tried to resize images
            // of all provided sizes in $sizes list.
            $resizedImageSrc = $this->getImageSrc($images, $width, $image, $imageData);
            if (!empty($resizedImageSrc)) {
                $src = $resizedImageSrc;
            }
            unset($resizedImageSrc);

            // Create the srcset
            $srcset = $this->getImageSrcset($images);
            if (!empty($srcset)) {
                // Note the whitespace before `srcset` attribute
                $newSrc .= sprintf(' srcset="%s"', $srcset);
            }
        }

        $attributes = $content[1];
        $isLazyload = strpos($content[1], 'data-src=') !== false;
        $attributes = $this->getImageAttributes($isLazyload, $newSrc, $src, $attributes, $dynamic);

        return '<img ' . $attributes . '/>';
    }

    /**
     * @param string $attributes
     * @param $src
     *
     * @return string
     */
    public function getLazyLoadSrc($attributes, $src)
    {
        $isLazyload = strpos($attributes, 'data-src=') !== false;
        if ($isLazyload) {
            preg_match('(\sdata-src=["|\'](.*?)["|\'])', $attributes, $matchesUrl);
            if (isset($matchesUrl[1])) {
                $src = set_url_scheme($matchesUrl[1]);
            }
        }

        return $src;
    }

    /**
     * Get a value for image `src` attribute
     *
     * @param array $images A list of resized images
     * @param int $width A width we are looking for
     * @param \WP_Image_Editor $image
     * @param array $imageData Image data
     *
     * @return string
     */
    public function getImageSrc($images, $width, $image = null, array $imageData = [])
    {
        $key = "{$width}w";
        if (!empty($images) && is_array($images) && array_key_exists($key, $images)) {
            return $images[ $key ];
        }

        if (!$image instanceof \WP_Image_Editor || empty($imageData)) {
            return '';
        }

        // Oops, image is not resized yet. Try to get an image again.
        $images = $this->getImages([$key => $width], $image, $imageData);
        if (!empty($images) && array_key_exists($key, $images)) {
            return $images[ $key ];
        }

        // Something definitely goes wrong
        return '';
    }

    /**
     * Get a value for image `srcset` attribute
     *
     * @param array $images
     *
     * @return string
     */
    public function getImageSrcset($images)
    {
        if (empty($images)) {
            return '';
        }

        $srcset = [];
        foreach ($images as $widthAttr => $imageSrc) {
            $srcset[] = sprintf('%s %s', esc_url($imageSrc), esc_attr($widthAttr));
        }

        return implode(', ', $srcset);
    }

    /**
     * @param $isLazyload
     * @param $newSrc
     * @param $src
     * @param $attributes
     * @param $dynamic
     *
     * @return string
     */
    protected function getImageAttributes($isLazyload, $newSrc, $src, $attributes, $dynamic)
    {
        if ($isLazyload) {
            $newSrc .= ' src=""';
            $newDataSrc = ' data-src="' . set_url_scheme($src) . '"';
            $attributes = preg_replace('(\sdata-src=["|\'](.*?)["|\'])', $newDataSrc, $attributes);
        } else {
            $urlSchemeSrc = set_url_scheme($src);
            $newSrc .= ' src="' . $urlSchemeSrc . '"';
        }
        $attributes = preg_replace('(\ssrc=["|\'](.*?)["|\'])', $newSrc, $attributes);
        $attributes = preg_replace('(data-default-image=["|\'](true|false)["|\'])', '', $attributes);
        if (!$dynamic) {
            $attributes = str_replace(['data-height', 'data-width'], ['height', 'width'], $attributes);
        }

        return $attributes;
    }

    /**
     * Calculate aspect ratio
     *
     * @param int $width
     * @param int $height
     *
     * @return float
     */
    public function getAspectRatio($width, $height)
    {
        return $width / $height;
    }

    /**
     * Get base URL
     *
     * @return string
     */
    public function getBaseUrl()
    {
        $uploadDir = wp_get_upload_dir();
        $baseUrl = trailingslashit($uploadDir['baseurl']);

        /*
         * If currently on HTTPS, prefer HTTPS URLs when we know they're supported by the domain
         * (which is to say, when they share the domain name of the current request).
         */
        if (
            is_ssl()
            && strpos($baseUrl, 'https') !== 0
            && wp_parse_url($baseUrl, PHP_URL_HOST) === $_SERVER['HTTP_HOST']
        ) {
            $baseUrl = set_url_scheme($baseUrl, 'https');
        }

        return $baseUrl;
    }

    /**
     * Get sizes
     *
     * @param array $imageData Image data. Keys "width" and "originalWidth" are required.
     *
     * @return array
     */
    public function getSizes(array $imageData)
    {
        if (empty($imageData['originalWidth']) || empty($imageData['width'])) {
            return [];
        }

        $originalWidth = $imageData['originalWidth'];
        $resizedWidth = $imageData['width'];

        // Pre-defined sizes
        $sizes = [
            '320w' => 320,
            '480w' => 480,
            '800w' => 800,
        ];

        // Calculate a size, based on a $width that come from the editor
        $sizes[ $resizedWidth . 'w' ] = (int)$resizedWidth;

        // Calculate retina size
        if ($resizedWidth * 2 <= $originalWidth) {
            $retinaImage = $resizedWidth * 2;
            $sizes['2x'] = (int)$retinaImage;
        }

        return $sizes;
    }

    /**
     * Get images by provided list of sizes
     *
     * If an attachment id is provided this method first checks images
     * already resized by WordPress.
     *
     * Performs resize for the rest of the images (or all if an attachment ID
     * is not provided or required sizes are not found in a list of WordPress
     * images).
     *
     * Returns a list of resized image, where key is a width attribute
     * (for srcset) and value is a relative path to image, for example:
     *
     * ```
     * [
     *   '320w' => '2022/06/Portfolio-4-320x213.jpg',
     *   '480w' => '2022/06/Portfolio-4-480x320.jpg',
     *   '2x' => '2022/06/Portfolio-4-2048x1366.jpg',
     * ]
     * ```
     *
     * @param array $sizes A list of sizes in format [320w => 320, ...]
     * @param \WP_Image_Editor $image Image
     * @param array $imageData Image data (width, height, attachmentId, etc)
     *
     * @return array
     *
     */
    public function getImages($sizes, $image, $imageData)
    {
        if (empty($sizes)) {
            return [];
        }

        // TODO: maybe check for cached images

        if (!empty($imageData['attachmentId'])) {
            $images = $this->getImagesFromAttachmentSizes($sizes, $imageData['attachmentId']);

            // Make sure we have all sizes
            $restOfSizes = array_diff_key($sizes, $images);
            if (!empty($restOfSizes)) {
                $resizedImages = $this->resizeImageBySizes($restOfSizes, $image, $imageData);
                $images = array_merge($images, $resizedImages);
            }
        } else {
            // Resize all images
            $images = $this->resizeImageBySizes($sizes, $image, $imageData);
        }

        // TODO: this is a good place to cache generated images

        // Images should be with a relative path without leading slash,
        // e.g. "2022/06/Image.jpg", so prepend them with a base URL
        $baseUrl = $this->getBaseUrl();
        foreach ($images as &$relativePathToImage) {
            $relativePathToImage = $baseUrl . $relativePathToImage;
        }
        unset($relativePathToImage);

        return $images;
    }

    /**
     * Get images from attachment sizes
     *
     * Try to look through a list of already resized images.
     * There may already be what we are looking for.
     *
     * @param array $sizes A list of sizes to search
     * @param int $attachmentId Attachment ID
     *
     * @return array
     */
    public function getImagesFromAttachmentSizes($sizes, $attachmentId)
    {
        $attachmentMeta = wp_get_attachment_metadata($attachmentId);
        if (empty($attachmentMeta) || empty($attachmentMeta['sizes'])) {
            return [];
        }

        $dirname = _wp_get_attachment_relative_path($attachmentMeta['file']);
        if ($dirname) {
            $dirname = trailingslashit($dirname);
        }

        $attachmentSizes = $attachmentMeta['sizes'];
        $images = [];
        foreach ($attachmentSizes as $image) {
            // Check if image meta isn't corrupted.
            if (!is_array($image)) {
                continue;
            }

            // Loop through the list of already resized images and try to find
            // a required "width". Once found - we can use it!
            if (in_array($image['width'], $sizes, true)) {
                $key = array_search($image['width'], $sizes, true);
                $images[ $key ] = $dirname . $image['file'];
            }
        }

        return $images;
    }

    /**
     * Resize a single image by provided list of sizes
     *
     * @param array $sizes A list of sizes in format [320w => 320]
     * @param \WP_Image_Editor $image Image
     * @param array $imageData Image data (width, height, attachmentId, etc)
     *
     * @return array
     */
    public function resizeImageBySizes($sizes, $image, $imageData)
    {
        $images = [];
        $uploadDir = wp_upload_dir();

        $dirname = $uploadDir['subdir'];
        if ($dirname) {
            $dirname = trailingslashit($dirname);
        }

        $aspectRatio = $this->getAspectRatio($imageData['width'], $imageData['height']);
        $retinaImage = array_key_exists('2x', $sizes);
        $fileHelper = vchelper('File');
        foreach ($sizes as $widthAttr => $width) {
            if ($width > $imageData['width'] && !$retinaImage) {
                continue;
            }

            $height = (int)round($width / $aspectRatio);
            $filename = "{$imageData['filename']}-{$width}x{$height}.{$imageData['extension']}";
            $absolutePath = "{$uploadDir['path']}/{$filename}";

            // Check if file already exists. No need to resize twice.
            if (!$fileHelper->exists($absolutePath)) {
                $resizedImage = $this->resizeImage($image, $imageData, $absolutePath, $width, $height, true);
                if (is_wp_error($resizedImage)) {
                    continue;
                }

                $filename = $resizedImage['file'];
            }

            // For consistency with "getImagesFromAttachmentSizes" method
            // return the relative path to the filename.
            $images[ $widthAttr ] = ltrim($dirname . $filename, '/\\');
        }

        return $images;
    }

    /**
     * Resize and save image
     *
     * @param \WP_Image_Editor $image Image editor object.
     * @param array $imageData Image data.
     * @param string $path Absolute path where to save an image.
     * @param int $width
     * @param int $height
     * @param bool $crop
     *
     * @return array|\WP_Error
     */
    public function resizeImage($image, $imageData, $path, $width = null, $height = null, $crop = false)
    {
        // For GD need to create a new object, because GD has a reference to a resource.
        // In case of ImageMagick it is possible to clone the object.
        if ($image instanceof \WP_Image_Editor_GD) {
            $newImage = wp_get_image_editor($imageData['path']);
        } else {
            $newImage = clone $image;
        }

        $newImage->resize($width, $height, $crop);

        return $newImage->save($path);
    }
}
