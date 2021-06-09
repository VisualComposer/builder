<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class EditorPostType implements Helper
{
    public function isEditorEnabled($postType)
    {
        // Note: cannot be removed because of BC (fatal error can arise if some addon uses this helper function)
        return vchelper('AccessUserCapabilities')->isEditorEnabled($postType);
    }

    public function getEnabledPostTypes()
    {
        // DEPRECATED: TODO: USE $currentUserAccessHelper->part('post_types')
        $optionsHelper = vchelper('Options');
        $postTypes = $optionsHelper->get('post-types', ['post', 'page']);

        return (array)vcfilter('vcv:helpers:access:editorPostType', empty($postTypes) ? [] : (array)$postTypes);
    }
}
