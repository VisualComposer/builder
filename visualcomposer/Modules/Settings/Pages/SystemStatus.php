<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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

    protected $defaultExecutionTime = 30; //In seconds

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

    protected function checkVersion($mustHaveVersion, $versionToCheck)
    {
        return !version_compare($mustHaveVersion, $versionToCheck, '>');
    }

    protected function getStatusCssClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    protected function getWpVersionResponse()
    {
        $checkVersion = $this->checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'));

        $textResponse = $checkVersion ? 'OK' : sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    protected function getPhpVersionResponse()
    {
        $checkVersion = $this->checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION);

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
        $memoryLimitToBytes = $this->call('convertMbToBytes', [$memoryLimit]);

        $check = ($memoryLimitToBytes >= $this->defaultMemoryLimit * 1024 * 1024);
        $textResponse = $check ? 'OK' : sprintf(__('Memory limit should be %sM, currently it is %s', 'vcwb'), $this->defaultMemoryLimit, $memoryLimit);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getTimeout()
    {
        $maxExecutionTime = (int)ini_get('max_execution_time');
        $check = false;
        if ($maxExecutionTime >= $this->defaultExecutionTime) {
            $check = true;
        }

        $textResponse = $check ? 'OK' : sprintf(__('Max execution time should be %sS, currently it is %sS', 'vcwb'), $this->defaultExecutionTime, $maxExecutionTime);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getUploadMaxFilesize()
    {
        $maxFileSize = ini_get('upload_max_filesize');
        $maxFileSizeToBytes = $this->call('convertMbToBytes', [$maxFileSize]);
        $check = false;

        if ($maxFileSizeToBytes >= $this->defaultFileUploadSize) {
            $check = true;
        }

        $textResponse = $check ? 'OK' : sprintf(__('File max upload size should be %sM, currently it is %s', 'vcwb'), $this->defaultFileUploadSize, $maxFileSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getUploadDirAccess()
    {
        $wpUploadDir = wp_upload_dir()['basedir'];
        $check = is_writable($wpUploadDir);

        $textResponse = $check ? 'OK' : __('Uploads directory is not writable', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getFileSystemMethod()
    {
        $check = true;
        if (defined('FS_METHOD') && FS_METHOD !== 'direct') {
            $check = false;
        }

        $textResponse = $check ? 'OK' : __('FS_METHOD should be direct', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
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
            'fsMethod' => $this->call('getFileSystemMethod'),
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
