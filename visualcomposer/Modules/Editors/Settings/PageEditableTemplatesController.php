<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PageEditableTemplatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddFilter(
            'template_include',
            'viewPePageTemplate',
            9
        );

        $this->addFilter('vcv:editor:settings:peTemplate', 'viewThemeTemplate');
        $this->addFilter('vcv:editor:settings:peTemplate', 'viewVcTemplate');
    }

    protected function viewPePageTemplate($originalTemplate, Frontend $frontendHelper, Request $requestHelper)
    {
        // TODO: Preview
        if ($frontendHelper->isPageEditable()/*|| $frontendHelper->isPreview()*/) {
            if ($requestHelper->exists('vcv-template') && $requestHelper->exists('vcv-template-type')) {
                return vcfilter(
                    'vcv:editor:settings:peTemplate',
                    $originalTemplate,
                    [
                        'type' => $requestHelper->input('vcv-template-type'),
                        'value' => $requestHelper->input('vcv-template'),
                    ]
                );
            }
        }

        return $originalTemplate;
    }

    protected function viewThemeTemplate($originalTemplate, $data)
    {
        if ($data && $data['type'] === 'theme') {
            $templateList = wp_get_theme()->get_page_templates();
            if (isset($templateList[ $data['value'] ])) {
                return $data['value'];
            } elseif ($data['value'] === 'default') {
                return get_page_template();
            }

        }

        return $originalTemplate;
    }

    protected function viewVcTemplate($originalTemplate, $data)
    {
        if ($data && $data['type'] === 'vc') {
            if (in_array($data['value'], ['blank', 'boxed'])) {
                $template = $data['value'] . '-template.php';

                return vcapp()->path('visualcomposer/resources/views/editor/templates/') . $template;
            }
        }

        return $originalTemplate;
    }
}
