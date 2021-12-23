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
        // set initial defaults
        $this->wpAddFilter(
            'template_include',
            'viewPeThemeDefaultTemplate',
            1
        );

        $this->wpAddFilter(
            'template_include',
            'viewPePageTemplate',
            15
        );

        $this->addFilter('vcv:editor:settings:peTemplate', 'viewThemeTemplate');
        $this->addFilter('vcv:editor:settings:peTemplate', 'viewVcTemplate');
        $this->addFilter('vcv:editor:settings:viewPageTemplate', 'viewThemeTemplate');
        $this->addFilter('vcv:editor:settings:viewPageTemplate', 'viewVcTemplate');
    }

    protected function viewPeThemeDefaultTemplate($originalTemplate, Frontend $frontendHelper, Request $requestHelper)
    {
        // set initial value to default
        // later other 3rd party plugins like woocommerce could override defaults to some specific
        $templateType = $requestHelper->input('vcv-template-type');
        $template = $requestHelper->input('vcv-template');
        $isThemeDefault = ($templateType === 'theme' && $template === 'default') || ($templateType === 'vc-custom-layout' && $template === 'theme:default');
        if ($frontendHelper->isPageEditable() && $isThemeDefault) {
            return $this->getDefaultTheme();
        }

        return $originalTemplate;
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
                        'stretchedContent' => (int)$requestHelper->input('vcv-template-stretched') === 1,
                    ]
                );
            }
        }

        return $originalTemplate;
    }

    protected function viewThemeTemplate($originalTemplate, $payload)
    {
        $isTheme = ($payload['type'] === 'theme' || ($payload['type'] === 'vc-custom-layout' && strpos($payload['value'], 'theme:') !== false));
        if ($payload && $isTheme) {
            $templateList = wp_get_theme()->get_page_templates();
            if ($payload['type'] === 'vc-custom-layout') {
                $payload['value'] = str_replace('theme:', '', $payload['value']);
            }
            if (isset($templateList[ $payload['value'] ])) {
                return locate_template($payload['value']);
            }
        }

        return $originalTemplate;
    }

    protected function viewVcTemplate($originalTemplate, $payload)
    {
        if ($payload && $payload['type'] === 'vc') {
            if ($payload['value'] === 'blank') {
                $stretched = isset($payload['stretchedContent']) ? $payload['stretchedContent'] : 0;
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
