<?php

namespace VisualComposer\Modules\Hub\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class Hub.
 */
class Hub extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-hub';

    /**
     * Hub constructor.
     */
    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            'addPage',
            20
        );
    }

    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');

        wp_register_script(
            'vcv:hub:script',
            $urlHelper->to('public/dist/hub.bundle.js'),
            ['vcv:assets:vendor:script', 'vcv:assets:runtime:script'],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:hub:style',
            $urlHelper->to('public/dist/hub.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:hub:script');
        wp_enqueue_style('vcv:hub:style');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if (vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            $atleastOneTabAvailableInHub = (
                $currentUserAccessHelper->part('hub')->can('elements_templates_blocks')->get()
                || $currentUserAccessHelper->part('hub')->can('addons')->get()
                || $currentUserAccessHelper->part('hub')->can('headers_footers_sidebars')->get()
                || $currentUserAccessHelper->part('hub')->can('unsplash')->get()
                || $currentUserAccessHelper->part('hub')->can('giphy')->get()
            );

            if (!$atleastOneTabAvailableInHub) {
                return;
            }
        }
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Visual Composer Hub', 'visualcomposer'),
            'layout' => 'dashboard-hub',
            'capability' => 'edit_posts',
            'iconClass' => 'vcv-ui-icon-dashboard-hub-shop',
            'isDashboardPage' => true,
            'hideTitle' => true,
            'hideInWpMenu' => false,
        ];
        $this->addSubmenuPage($page, false);
    }

    /**
     * @param $response
     *
     * @return string
     */
    public function afterRender($response)
    {
        ob_start();
        $extraOutput = vcfilter('vcv:frontend:hub:extraOutput', []);
        $outputHelper = vchelper('Output');
        if (is_array($extraOutput)) {
            foreach ($extraOutput as $output) {
                $outputHelper->printNotEscaped($output);
            }
            unset($output);
        }
        $variables = vcfilter('vcv:hub:variables', []);
        if (is_array($variables)) {
            foreach ($variables as $variable) {
                if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                    $type = isset($variable['type']) ? $variable['type'] : 'variable';
                    evcview('partials/variableTypes/' . $type, $variable);
                }
            }
            unset($variable);
        }
        $hubContent = ob_get_clean();

        return $response . implode('', vcfilter('vcv:update:extraOutput', [])) . $hubContent
            . '<div id="vcv-hub" class="vcv-hub"></div>';
    }
}
