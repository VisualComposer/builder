<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;
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
            12
        );

        $this->addFilter('vcv:editor:settings:peTemplate', 'viewThemeTemplate');
        $this->addFilter('vcv:editor:settings:peTemplate', 'viewVcTemplate');
        $this->addFilter('vcv:editor:settings:viewPageTemplate', 'viewThemeTemplate');
        $this->addFilter('vcv:editor:settings:viewPageTemplate', 'viewVcTemplate');
    }

    protected function viewPePageTemplate($originalTemplate, Frontend $frontendHelper, Request $requestHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            if ($requestHelper->exists('vcv-template') && $requestHelper->exists('vcv-template-type')) {
                return vcfilter(
                    'vcv:editor:settings:peTemplate',
                    $originalTemplate,
                    [
                        'type' => $requestHelper->input('vcv-template-type'),
                        'value' => $requestHelper->input('vcv-template'),
                        'stretchedContent' => intval($requestHelper->input('vcv-template-stretched')) === 1,
                    ]
                );
            }
        }

        return $originalTemplate;
    }

    protected function viewThemeTemplate($originalTemplate, $data, File $fileHelper)
    {
        if ($data && $data['type'] === 'theme') {
            $templateList = wp_get_theme()->get_page_templates();
            if (isset($templateList[ $data['value'] ])) {
                return locate_template($data['value']);
            } elseif ($data['value'] === 'default') {
                if ($fileHelper->isFile($originalTemplate)) {
                    return $originalTemplate;
                }

                return $this->getDefaultTheme();
            }
        }

        return $originalTemplate;
    }

    protected function viewVcTemplate($originalTemplate, $data)
    {
        if ($data && $data['type'] === 'vc') {
            if ($data['value'] === 'blank') {
                $stretched = isset($data['stretchedContent']) ? $data['stretchedContent'] : 0;
                $template = 'blank' . ($stretched ? '-stretched' : '') . '-template.php';

                return vcapp()->path('visualcomposer/resources/views/editor/templates/' . $template);
            }
        }

        return $originalTemplate;
    }

    /**
     * This function is simplified for PageEditable function without current saved
     * @see \get_page_template()
     */
    protected function getDefaultTheme()
    {
        $id = get_queried_object_id();
        $pagename = get_query_var('pagename');

        if (!$pagename && $id) {
            // If a static page is set as the front page, $pagename will not be set. Retrieve it from the queried object
            $post = get_queried_object();
            if ($post) {
                // @codingStandardsIgnoreLine
                $pagename = $post->post_name;
            }
        }

        if ($pagename) {
            $pagenameDecoded = urldecode($pagename);
            if ($pagenameDecoded !== $pagename) {
                $templates[] = "page-{$pagenameDecoded}.php";
            }
            $templates[] = "page-{$pagename}.php";
        }
        if ($id) {
            $templates[] = "page-{$id}.php";
        }
        $templates[] = 'page.php';

        return get_query_template('page', $templates);
    }
}
