<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Revision
 *
 * @package VisualComposer\Helpers
 */
class Revision implements Helper
{
    /**
     * Get revision parent post type.
     *
     * @param int $revisionId
     *
     * @return string
     */
    public function getRevisionParentPostType($revisionId)
    {
        $parentPostType = 'revision';

        $parentPost = get_post_parent($revisionId);
        // @codingStandardsIgnoreLine
        if (!empty($parentPost->post_type)) {
            // @codingStandardsIgnoreLine
            $parentPostType = $parentPost->post_type;
        }

        return $parentPostType;
    }
}
