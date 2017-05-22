<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to editor/templates.
 * Class EditorTemplates.
 */
class EditorTemplates implements Helper
{
    /**
     * @return array
     */
    public function all()
    {
        $templates = vchelper('PostType')->query('post_type=vcv_templates&numberposts=-1&orderby=post_date&order=desc');

        return $templates;
    }

    /**
     * @return array
     */
    public function allPredefined()
    {
        $optionHelper = vchelper('Options');
        $predefinedTemplates = $optionHelper->get('predefinedTemplates', []);
        $templates = [];
        foreach ($predefinedTemplates as $template) {
            $template['data'] = $optionHelper->get('predefinedTemplateElements:' . $template['id']);
            $templates[] = $template;
        }

        return $templates;
    }

    /**
     * @param $templateId
     *
     * @return \WP_Post
     */
    public function get($templateId)
    {
        $template = vchelper('PostType')->get($templateId, 'vcv_templates');

        return $template;
    }
}
