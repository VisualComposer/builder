<?php

namespace VisualComposer\Helpers\Access;

use VisualComposer\Framework\Illuminate\Support\Helper;

class EditorPostType implements Helper
{
    public function isEditorEnabled($postType)
    {

        return in_array($postType, $this->getEnabledPostTypes());
    }

    public function getEnabledPostTypes()
    {
        $optionsHelper = vchelper('Options');

        return (array)$optionsHelper->get('post-types', ['post', ['page']]);
    }
}
