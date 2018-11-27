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

    protected $defaultExecutionTime = 30;
    protected $defaultMemoryLimit = 256; //In MB
    protected $defaultFileUploadSize = 5; //In MB

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

    protected function getStatusCssClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    protected function getWpVersionResponse()
    {
        $checkVersion = $this->requirements->checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'));

        $textResponse = $checkVersion ? 'OK' : sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    protected function getPhpVersionResponse()
    {
        $checkVersion = $this->requirements->checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION);

        $textResponse = $checkVersion ? 'OK' : sprintf('PHP version %s or greater (recommended 7 or greater)', VCV_REQUIRED_PHP_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    protected function getVersionResponse()
    {
        return VCV_VERSION;
    }

    protected function getWpDebugResponse()
    {
        $check = !WP_DEBUG;

        $textResponse = $check ? 'OK' : 'WP_DEBUG is TRUE';

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function convertMbToBytes($size)
    {
        if (preg_match('/^(\d+)(.)$/', $size, $matches)) {
            if ($matches[2] == 'G') {
                $size = (int)$matches[1] * 1024 * 1024 * 1024;
            } elseif ($matches[2] == 'M') {
                $size = (int)$matches[1] * 1024 * 1024;
            } elseif ($matches[2] == 'K') {
                $size = (int)$matches[1] * 1024;
            }
        }

        return $size;
    }
    protected function getMemoryLimit()
    {
        $memoryLimit = ini_get('memory_limit');
        $memoryLimit = $this->call('convertMbToBytes', [$memoryLimit]);

        return ($memoryLimit >= $this->defaultMemoryLimit * 1024 * 1024);
    }

    protected function getTimeout()
    {
        $maxExecutionTime = (int)ini_get('max_execution_time');
        if ($maxExecutionTime >= $this->defaultExecutionTime) {
            return true;
        }

        return false;
    }

    protected function getUploadMaxFilesize()
    {
        $maxFileSize = ini_get('upload_max_filesize');
        $maxFileSize = $this->call('convertMbToBytes', [$maxFileSize]);
        if ($maxFileSize >= $this->defaultFileUploadSize) {
            return true;
        }

        return false;
    }

    protected function getUploadDirAccess()
    {
        $wpUploadDir = wp_upload_dir()['basedir'];
        return is_writable($wpUploadDir);
    }

    protected function getFileSystemMethod()
    {
        if (defined('FS_METHOD') && FS_METHOD !== 'direct') {
            return false;
        }

        return true;
    }

    protected function getRenderArgs()
    {
        return [
            'phpVersion' => $this->getPhpVersionResponse(),
            'wpVersion' => $this->getWpVersionResponse(),
            'vcVersion' => $this->getVersionResponse(),
            'wpDebug' => $this->getWpDebugResponse(),
            'memoryLimit' => $this->call('getMemoryLimit'),
            'timeout' => $this->call('gettimeout'),
            'fileUploadSize' => $this->call('getUploadMaxFilesize'),
            'uploadDirAccess' => $this->call('getUploadDirAccess'),
            'fsMethod' => $this->call('getFileSystemMethod')
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
