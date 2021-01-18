<?php

namespace VisualComposer\Modules\Settings\Pages;

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
        if (!vcvenv('VCV_FT_DASHBOARD_HUB')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            'addPage',
            3
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');
    }

    protected function subMenuHighlight($submenuFile)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $submenuFile = 'vcv-settings';
        }

        return $submenuFile;
    }

    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');

        // Get dashboard styles
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpVcSettings:style');

        // Get hub style and scripts
        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
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
        wp_enqueue_script('vcv:wpVcSettings:script');
        wp_enqueue_script('vcv:hub:script');
        wp_enqueue_style('vcv:hub:style');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Visual Composer Hub', 'visualcomposer'),
            'layout' => 'dashboard-hub',
            'capability' => 'manage_options',
            'iconClass' => 'vcv-ui-icon-dashboard-hub-shop',
            'isDashboardPage' => true,
            'hideTitle' => true,
            'hideInWpMenu' => true,
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
        if (is_array($extraOutput)) {
            foreach ($extraOutput as $output) {
                echo $output;
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
        return $response . implode('', vcfilter('vcv:update:extraOutput', [])) . $hubContent . '<div id="vcv-hub" class="vcv-hub"></div>';
    }
}
