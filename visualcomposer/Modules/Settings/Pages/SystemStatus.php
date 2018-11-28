<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Status;
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

    /** @var \VisualComposer\Helpers\Status */
    protected $statusHelper;

    public function __construct(Status $statusHelper)
    {
        if (!vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            'addPage',
            10
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->statusHelper = $statusHelper;
    }

    protected function subMenuHighlight($submenuFile)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $submenuFile = 'vcv-settings';
        }

        return $submenuFile;
    }

    protected function getRenderArgs()
    {
        return [
            'phpVersion' => $this->statusHelper->getPhpVersionResponse(),
            'wpVersion' => $this->statusHelper->getWpVersionResponse(),
            'vcVersion' => $this->statusHelper->getVersionResponse(),
            'wpDebug' => $this->statusHelper->getWpDebugResponse(),
            'memoryLimit' => $this->statusHelper->getMemoryLimit(),
            'timeout' => $this->statusHelper->getTimeout(),
            'fileUploadSize' => $this->statusHelper->getUploadMaxFilesize(),
            'uploadDirAccess' => $this->statusHelper->getUploadDirAccess(),
            'fsMethod' => $this->statusHelper->getFileSystemMethod(),
            'zipExt' => $this->statusHelper->getZipExtension(),
            'curlExt' => $this->statusHelper->getCurlExtension(),
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
            'layout' => 'settings-standalone-with-tabs',
            'showTab' => false,
            'controller' => $this,
        ];
        $this->addSubmenuPage($page);
    }
}
