<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
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

    /** @var \VisualComposer\Helpers\Options  */
    protected $optionsHelper;

    public function __construct(Status $statusHelper, Options $optionsHelper)
    {
        if (!vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            'addPage'
        );

        $this->wpAddAction(
            'admin_menu',
            'systemCheck'
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->statusHelper = $statusHelper;
        $this->optionsHelper = $optionsHelper;
    }

    protected function subMenuHighlight($submenuFile)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $submenuFile = 'vcv-settings';
        }

        return $submenuFile;
    }

    /**
     * @param $response
     *
     * @return mixed
     */
    protected function systemCheck($response)
    {
        if ($this->optionsHelper->getTransient('lastSystemCheck') < time()) {
            $this->statusHelper->checkSystemStatusAndSetFlag();
            $this->optionsHelper->setTransient('lastSystemCheck', time() + DAY_IN_SECONDS);
        }

        return $response;
    }

    protected function getStatusCssClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    public function getPhpVersionStatusForView()
    {
        $checkVersion = $this->statusHelper->getPhpVersionStatus();
        $textResponse = $checkVersion ? PHP_VERSION : sprintf('PHP version %s or greater (recommended 7 or greater)', VCV_REQUIRED_PHP_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    public function getWpVersionStatusForView()
    {
        $wpVersionCheck = $this->statusHelper->getWpVersionStatus();
        $textResponse = $wpVersionCheck ? get_bloginfo('version') : sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($wpVersionCheck)];
    }

    public function getWpDebugStatusForView()
    {
        $check = $this->statusHelper->getWpDebugStatus();

        $textResponse = $check ? 'Enabled' : 'WP_DEBUG is TRUE';

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getMemoryLimitStatusForView()
    {
        $memoryLimit = $this->statusHelper->getMemoryLimit();
        $memoryLimitCheck = $this->statusHelper->getMemoryLimitStatus();

        $textResponse = $memoryLimitCheck ? $memoryLimit : sprintf(__('Memory limit should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultMemoryLimit(), $memoryLimit);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($memoryLimitCheck)];
    }

    public function getTimeoutStatusForView()
    {
        $maxExecutionTime = $this->statusHelper->getMaxExecutionTime();
        $maxExecutionTimeCheck = $this->statusHelper->getTimeoutStatus();
        $textResponse = $maxExecutionTimeCheck ? $maxExecutionTime : sprintf(__('Max execution time should be %sS, currently it is %sS', 'vcwb'), $this->statusHelper->getDefaultExecutionTime(), $maxExecutionTime);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxExecutionTimeCheck)];
    }

    public function getUploadMaxFileSizeStatusForView()
    {
        $maxFileSize = $this->statusHelper->getMaxUploadFileSize();
        $maxFileSizeCheck = $this->statusHelper->getUploadMaxFileSizeStatus();
        $textResponse = $maxFileSizeCheck ? $maxFileSize : sprintf(__('File max upload size should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultFileUploadSize(), $maxFileSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxFileSizeCheck)];
    }

    protected function getUploadDirAccessStatusForView()
    {
        $accessCheck = $this->statusHelper->getUploadDirAccessStatus();
        $textResponse = $accessCheck ? 'Writable' : __('Uploads directory is not writable', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($accessCheck)];
    }

    protected function getFileSystemStatusForView()
    {
        $fsStatus = $this->statusHelper->getFileSystemStatus();
        $textResponse = $fsStatus ? 'Direct' : __('FS_METHOD should be direct', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($fsStatus)];
    }

    protected function getZipStatusForView()
    {
        $zipStatus = $this->statusHelper->getZipStatus();
        $textResponse = $zipStatus ? 'Enabled' : __('Zip extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($zipStatus)];
    }

    protected function getCurlStatusForView()
    {
        $curlStatus = $this->statusHelper->getCurlStatus();
        $textResponse = $curlStatus ? curl_version()['version'] : __('Curl extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($curlStatus)];
    }

    protected function getRenderArgs()
    {
        return [
            'phpVersion' => $this->getPhpVersionStatusForView(),
            'wpVersion' => $this->getWpVersionStatusForView(),
            'vcVersion' => $this->statusHelper->getVcvVersion(),
            'wpDebug' => $this->getWpDebugStatusForView(),
            'memoryLimit' => $this->getMemoryLimitStatusForView(),
            'timeout' => $this->getTimeoutStatusForView(),
            'fileUploadSize' => $this->getUploadMaxFileSizeStatusForView(),
            'uploadDirAccess' => $this->getUploadDirAccessStatusForView(),
            'fsMethod' => $this->getFileSystemStatusForView(),
            'zipExt' => $this->getZipStatusForView(),
            'curlExt' => $this->getCurlStatusForView(),
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
