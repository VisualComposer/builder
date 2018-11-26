<?php

namespace VisualComposer\Modules\Settings\Pages;

use VcvCoreRequirements;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

class SystemStatus extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-system-status';

    /*
     * @var string
     */
    protected $templatePath = 'settings/pages/system-status';

    /** @var \VcvCoreRequirements */
    private $requirements;

    public function __construct()
    {
        if (!vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            'addPage',
            10
        );

        $this->requirements = new VcvCoreRequirements();
    }

    protected function getStatusCSSClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    protected function getWPVersionResponse()
    {
        $checkVersion = $this->requirements->checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'));

        $textResponse = $checkVersion
            ? 'OK'
            : sprintf(
                'WordPress version %s or greater',
                VCV_REQUIRED_BLOG_VERSION
            );

        return ['text' => $textResponse, 'status' => $this->getStatusCSSClass($checkVersion)];
    }

    protected function getPHPVersionResponse()
    {
        $checkVersion = $this->requirements->checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION);

        $textResponse = $checkVersion
            ? 'OK'
            : sprintf(
                'PHP version %s or greater (recommended 7 or greater)',
                VCV_REQUIRED_PHP_VERSION
            );

        return ['text' => $textResponse, 'status' => $this->getStatusCSSClass($checkVersion)];
    }

    protected function getVCVersionResponse()
    {
        return VCV_VERSION;
    }

    protected function getWPDebugResponse()
    {
        $check = !WP_DEBUG;

        $textResponse = $check ? 'OK' : 'WP_DEBUG is TRUE';

        return ['text' => $textResponse, 'status' => $this->getStatusCSSClass($check)];
    }

    protected function getRenderArgs()
    {
        return [
            'PHP_version' => $this->getPHPVersionResponse(),
            'WP_version' => $this->getWPVersionResponse(),
            'VC_version' => $this->getVCVersionResponse(),
            'WP_debug' => $this->getWPDebugResponse(),
        ];
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_style(
            'vcv:wpUpdateRedesign:style',
            $urlHelper->assetUrl('dist/wpUpdateRedesign.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpUpdateRedesign:style');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('System status', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
        ];
        $this->addSubmenuPage($page);
    }
}
