<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper for working with media content
 * Class WpMedia.
 * @codingStandardsIgnoreFile
 * @codeCoverageIgnore
 */
class WpMedia implements Helper
{
    public function getImageBySize($params = [])
    {
        $imgUrl = '';
        $params = array_merge(
            [
                'attach_id' => null,
                'thumb_size' => 'thumbnail',
                'class' => '',
            ],
            $params
        );
        if (!$params['thumb_size']) {
            $params['thumb_size'] = 'thumbnail';
        }

        if (!$params['attach_id']) {
            return false;
        }
        $attach_id = $params['attach_id'];
        $thumb_size = $params['thumb_size'];
        $thumb_class = (isset($params['class']) && '' !== $params['class']) ? $params['class'] . ' ' : '';
        global $_wp_additional_image_sizes;
        $thumbnail = '';
        if (
            is_string($thumb_size)
            && ((!empty($_wp_additional_image_sizes[ $thumb_size ])
                    && is_array(
                        $_wp_additional_image_sizes[ $thumb_size ]
                    ))
                || in_array(
                    $thumb_size,
                    [
                        'thumbnail',
                        'thumb',
                        'medium',
                        'large',
                        'full',
                    ],
                    true
                ))
        ) {
            $attributes = ['class' => $thumb_class . 'attachment-' . $thumb_size];
            $thumbnail = wp_get_attachment_image($attach_id, $thumb_size, false, $attributes);
            $imgUrl = image_downsize($attach_id, $thumb_size);
        } elseif ($attach_id) {
            $thumb_size = $this->getThumbSize($thumb_size);
            if (is_array($thumb_size)) {
                // Resize image to custom size
                $p_img = $this->resizeImageById($attach_id, $thumb_size[0], $thumb_size[1], true);
                $alt = trim(wp_strip_all_tags(get_post_meta($attach_id, '_wp_attachment_image_alt', true)));
                $attachment = get_post($attach_id);
                if (!empty($attachment)) {
                    $title = trim(wp_strip_all_tags($attachment->post_title));
                    if (empty($alt)) {
                        $alt = trim(wp_strip_all_tags($attachment->post_excerpt)); // If not, Use the Caption
                    }
                    if (empty($alt)) {
                        $alt = $title;
                    } // Finally, use the title
                    if ($p_img) {
                        $attributes = $this->stringifyAttributes(
                            [
                                'class' => $thumb_class,
                                'src' => $p_img['url'],
                                'width' => $p_img['width'],
                                'height' => $p_img['height'],
                                'alt' => $alt,
                                'title' => $title,
                            ]
                        );
                        $thumbnail = '<img ' . $attributes . ' />';
                        $imgUrl = $p_img['url'];
                    }
                }
            }
        }
        $p_img_large = wp_get_attachment_image_src($attach_id, 'large');

        return [
            'imgUrl' => $imgUrl,
            'thumbnail' => $thumbnail,
            'p_img_large' => $p_img_large,
        ];
    }

    protected function resizeImageById($id, $width, $height, $crop = false)
    {
        // this is an attachment, so we have the ID
        $image_src = wp_get_attachment_image_src($id, 'full');
        $actual_file_path = get_attached_file($id);
        if (!empty($actual_file_path)) {
            return $this->processImageResize($actual_file_path, $image_src, $width, $height, $crop);
        }

        return false;
    }

    protected function processImageResize($filePath, $image_src, $width, $height, $crop = false)
    {
        $file_info = pathinfo($filePath);
        $extension = '.' . $file_info['extension'];
        // the image path without the extension
        $no_ext_path = $file_info['dirname'] . '/' . $file_info['filename'];
        $cropped_img_path = $no_ext_path . '-' . $width . 'x' . $height . $extension;
        // checking if the file size is larger than the target size
        // if it is smaller or the same size, stop right here and return
        if ($image_src[1] > $width || $image_src[2] > $height) {
            $fileHelper = vchelper('File');
            if ($fileHelper->exists($cropped_img_path)) {
                $cropped_img_url = str_replace(basename($image_src[0]), basename($cropped_img_path), $image_src[0]);
                $vt_image = [
                    'url' => $cropped_img_url,
                    'width' => $width,
                    'height' => $height,
                ];

                return $vt_image;
            }
            if ($crop === false) {
                // calculate the size proportionally
                $proportional_size = wp_constrain_dimensions($image_src[1], $image_src[2], $width, $height);
                $resized_img_path = $no_ext_path . '-' . $proportional_size[0] . 'x' . $proportional_size[1]
                    . $extension;
                // checking if the file already exists
                if ($fileHelper->exists($resized_img_path)) {
                    $resized_img_url = str_replace(
                        basename($image_src[0]),
                        basename($resized_img_path),
                        $image_src[0]
                    );
                    $vt_image = [
                        'url' => $resized_img_url,
                        'width' => $proportional_size[0],
                        'height' => $proportional_size[1],
                    ];

                    return $vt_image;
                }
            }
            // no cache files - let's finally resize it
            $img_editor = wp_get_image_editor($filePath);
            if (is_wp_error($img_editor) || is_wp_error($img_editor->resize($width, $height, $crop))) {
                return [
                    'url' => '',
                    'width' => '',
                    'height' => '',
                ];
            }
            $new_img_path = $img_editor->generate_filename();
            if (is_wp_error($img_editor->save($new_img_path))) {
                return [
                    'url' => '',
                    'width' => '',
                    'height' => '',
                ];
            }
            if (!is_string($new_img_path)) {
                return [
                    'url' => '',
                    'width' => '',
                    'height' => '',
                ];
            }
            $new_img_size = getimagesize($new_img_path);
            $new_img = str_replace(basename($image_src[0]), basename($new_img_path), $image_src[0]);
            // resized output
            $vt_image = [
                'url' => $new_img,
                'width' => $new_img_size[0],
                'height' => $new_img_size[1],
            ];

            return $vt_image;
        }
        // default output - without resizing
        $vt_image = [
            'url' => $image_src[0],
            'width' => $image_src[1],
            'height' => $image_src[2],
        ];

        return $vt_image;
    }

    public function getThumbSize($thumb_size)
    {
        if (is_string($thumb_size)) {
            preg_match_all('/\d+/', $thumb_size, $thumb_matches);
            if (isset($thumb_matches[0])) {
                $thumb_size = [];
                if (count($thumb_matches[0]) > 1) {
                    $thumb_size[] = $thumb_matches[0][0]; // width
                    $thumb_size[] = $thumb_matches[0][1]; // height
                } elseif (count($thumb_matches[0]) > 0 && count($thumb_matches[0]) < 2) {
                    $thumb_size[] = $thumb_matches[0][0]; // width
                    $thumb_size[] = $thumb_matches[0][0]; // height
                } else {
                    $thumb_size = false;
                }
            }
        }

        return $thumb_size;
    }

    /**
     * Convert array of named params to string version
     * All values will be escaped
     *
     * E.g. f(array('name' => 'foo', 'id' => 'bar')) -> 'name="foo" id="bar"'
     *
     * @param $attributes
     *
     * @return string
     */
    protected function stringifyAttributes($attributes)
    {
        $atts = [];
        foreach ($attributes as $name => $value) {
            $atts[] = $name . '="' . esc_attr($value) . '"';
        }

        return implode(' ', $atts);
    }

    public function getSizes()
    {
        global $_wp_additional_image_sizes;
        $sizes = [];

        foreach (get_intermediate_image_sizes() as $_size) {
            if (in_array($_size, ['thumbnail', 'medium', 'medium_large', 'large'], true)) {
                $sizeWidth = get_option("{$_size}_size_w");
                $sizeHeight = get_option("{$_size}_size_h");
                $sizeCrop = get_option("{$_size}_crop");
                if ($sizeWidth > 0 && $sizeHeight > 0) {
                    $sizes[ $_size ]['width'] = (int)$sizeWidth;
                    $sizes[ $_size ]['height'] = (int)$sizeHeight;
                    $sizes[ $_size ]['crop'] = (bool)$sizeCrop;
                }
            } elseif (isset($_wp_additional_image_sizes[ $_size ])) {
                $sizes[ $_size ] = [
                    'width' => (int)$_wp_additional_image_sizes[ $_size ]['width'],
                    'height' => (int)$_wp_additional_image_sizes[ $_size ]['height'],
                    'crop' => (bool)$_wp_additional_image_sizes[ $_size ]['crop'],
                ];
            }
        }

        return $sizes;
    }

    public function checkIsImage($string)
    {
        $re = '/(\.png|jpg|jpeg|gif)$/';

        return preg_match($re, strtolower($string));
    }

    public function checkIsVideo($string)
    {
        $re = '/(\.mp4|avi|flv|wmv|mov)$/';

        return preg_match($re, strtolower($string));
    }

    /**
     * @param $element
     *
     * @return array
     */
    public function getElementMedia($element)
    {
        $media = [];

        foreach ($element as $propKey => $propValue) {
            if (in_array($propKey, ['metaThumbnailUrl', 'metaPreviewUrl'], true)) {
                continue;
            }
            // first level
            if (!isset($propValue['urls']) && (is_string($propValue) || $propKey === "image" || $propKey === "video")) {
                if (isset($propValue[0]) && ($propKey === "image" || $propKey === "video") && is_array($propValue)) {
                    $vals = [];
                    foreach ($propValue as $image) {
                        if ($this->checkIsImage($image) || $this->checkIsVideo($image)) {
                            $vals[] = $image;
                        }
                    }
                    if (!empty($vals)) {
                        $media[] = [
                            'complex' => true,
                            'value' => $vals,
                            'key' => $propKey,
                        ];
                    }
                } else {
                    if ($this->checkIsImage($propValue) || $this->checkIsVideo($propValue)) {
                        $media[] = [
                            'url' => $propValue,
                            'key' => $propKey,
                        ];
                    }
                }
                // second level
            } elseif (is_array($propValue) && isset($propValue['urls'])) {
                $media[] = [
                    'complex' => true,
                    'value' => $propValue,
                    'key' => $propKey,
                ];
            }
        }

        return [
            'elementId' => $element['id'],
            'media' => $media,
        ];
    }

    /**
     * @param $elements
     *
     * @return array
     */
    public function getTemplateElementMedia($elements)
    {
        $media = [];
        foreach ($elements as $element) {
            $elementMedia = $this->getElementMedia($element);
            if ($elementMedia['media']) {
                $media[] = $elementMedia;
            }
        }

        return $media;
    }
}
