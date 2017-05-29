<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
     * @param bool $data
     *
     * @param bool $id
     *
     * @return array
     */
    public function allPredefined($data = true, $id = false)
    {
        $optionHelper = vchelper('Options');
        $predefinedTemplates = $optionHelper->get('predefinedTemplates', []);
        $templates = [];
        foreach ($predefinedTemplates as $template) {
            if ($data) {
                $template['data'] = $optionHelper->get('predefinedTemplateElements:' . $template['id']);
            }
            if ($id) {
                $templates[ $template['id'] ] = $template;
            } else {
                $templates[] = $template;
            }
        }

        return $templates;
    }

    public function setPredefined(array $templates)
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('predefinedTemplates', $templates);
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
