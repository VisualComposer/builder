<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;
use VisualComposer\Helpers\Traits\EventsFilters;

class SystemStatus extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

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

    /** @var \VisualComposer\Helpers\Options */
    protected $optionsHelper;

    public function __construct(Status $statusHelper, Options $optionsHelper)
    {
        $this->wpAddAction(
            'admin_menu',
            'addPage'
        );

        $this->wpAddAction(
            'admin_menu',
            'systemCheck'
        );

        $this->wpAddAction('current_screen', 'addWarningNotice');

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->addFilter('vcv:ajax:vcv:settings:systemStatus:refresh:adminNonce', 'refreshStatusPage');

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
        // translators: %s: PHP version.
        $textResponse = $checkVersion ? PHP_VERSION : sprintf(__('PHP version %s or greater (recommended 7 or greater)', 'visualcomposer'), VCV_REQUIRED_PHP_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    public function getWpVersionStatusForView()
    {
        $wpVersionCheck = $this->statusHelper->getWpVersionStatus();
        // translators: %s: WordPress version.
        $textResponse = $wpVersionCheck ? get_bloginfo('version') : sprintf(__('WordPress version %s or greater', 'visualcomposer'), VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($wpVersionCheck)];
    }

    public function getWpDebugStatusForView()
    {
        $check = $this->statusHelper->getWpDebugStatus();

        $textResponse = $check ? __('WP_DEBUG, false', 'visualcomposer') : __('WP_DEBUG, true', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getPostMaxSize()
    {
        $postMaxSize = $this->statusHelper->postMaxSize();
        $postMaxSizeTest = $this->statusHelper->getPostMaxSizeStatus();

        if ($postMaxSize === '-1') {
            $postMaxSize = __('Unlimited', 'visualcomposer');
        }

        // translators: %1$s: post_max_size, %2$s: recommended post_max_size.
        $textResponse = $postMaxSizeTest ? $postMaxSize : sprintf(__('Post max size should be %1$sM, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultPostMaxSize(), $postMaxSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($postMaxSizeTest)];
    }

    public function getMemoryLimitStatusForView()
    {
        $memoryLimit = $this->statusHelper->getPhpVariable('memory_limit');
        $memoryLimitCheck = $this->statusHelper->getMemoryLimitStatus();

        if ($memoryLimit === '-1') {
            $memoryLimit = __('Unlimited', 'visualcomposer');
        }

        // translators: %1$s: default memory limit., %2$s: memory_limit.
        $textResponse = $memoryLimitCheck ? $memoryLimit : sprintf(__('Memory limit should be %1$sM, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultMemoryLimit(), $memoryLimit);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($memoryLimitCheck)];
    }

    public function getPostMaxSizeStatusForView()
    {
        $postMaxSize = $this->statusHelper->getPhpVariable('post_max_size');
        $postMaxSizeCheck = $this->statusHelper->getPostMaxSizeStatus();

        if ($postMaxSize === '0') {
            $postMaxSize = __('Unlimited', 'visualcomposer');
        }

        // translators: %1$s: default post max size., %2$s: post_max_size.
        $textResponse = $postMaxSizeCheck ? $postMaxSize : sprintf(__('post_max_size limit should be %1$sM, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultPostMaxSize(), $postMaxSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($postMaxSizeCheck)];
    }

    public function getMaxInputNestingLevelStatusForView()
    {
        $maxInputNestingLevel = (int)$this->statusHelper->getPhpVariable('max_input_nesting_level');
        $maxInputNestingLevelCheck = $this->statusHelper->getMaxInputNestingLevelStatus();

        // translators: %1$s: default max_input_nesting_level., %2$s: max_input_nesting_level.
        $textResponse = $maxInputNestingLevelCheck ? $maxInputNestingLevel : sprintf(__('max_input_nesting_level should be %1$s, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultMaxInputNestingLevel(), $maxInputNestingLevel);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxInputNestingLevelCheck)];
    }

    public function getMaxInputVarsStatusForView()
    {
        $maxInputVars = (int)$this->statusHelper->getPhpVariable('max_input_vars');
        $maxInputVarsCheck = $this->statusHelper->getMaxInputVarsStatus();

        // translators: %1$s: default max_input_vars., %2$s: max_input_vars.
        $textResponse = $maxInputVarsCheck ? $maxInputVars : sprintf(__('max_input_vars should be %1$s, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultMaxInputVars(), $maxInputVars);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxInputVarsCheck)];
    }

    public function getTimeoutStatusForView()
    {
        $maxExecutionTime = (int)$this->statusHelper->getPhpVariable('max_execution_time');
        $maxExecutionTimeCheck = $this->statusHelper->getTimeoutStatus();
        // translators: %1$s: default max_execution_time., %2$s: max_execution_time.
        $textResponse = $maxExecutionTimeCheck ? $maxExecutionTime : sprintf(__('Max execution time should be %1$sS, currently it is %2$sS', 'visualcomposer'), $this->statusHelper->getDefaultExecutionTime(), $maxExecutionTime);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxExecutionTimeCheck)];
    }

    public function getUploadMaxFileSizeStatusForView()
    {
        $maxFileSize = $this->statusHelper->getPhpVariable('upload_max_filesize');
        $maxFileSizeCheck = $this->statusHelper->getUploadMaxFileSizeStatus();
        // translators: %1$s: default upload_max_filesize., %2$s: upload_max_filesize.
        $textResponse = $maxFileSizeCheck ? $maxFileSize : sprintf(__('File max upload size should be %1$sM, currently it is %2$s', 'visualcomposer'), $this->statusHelper->getDefaultFileUploadSize(), $maxFileSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxFileSizeCheck)];
    }

    protected function getUploadDirAccessStatusForView()
    {
        $accessCheck = $this->statusHelper->getUploadDirAccessStatus();
        $textResponse = $accessCheck ? __('Writable', 'visualcomposer') : __('Uploads directory is not writable', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($accessCheck)];
    }

    protected function getFileSystemStatusForView()
    {
        $fsStatus = $this->statusHelper->getFileSystemStatus();
        $textResponse = $fsStatus ? __('Direct', 'visualcomposer') : __('FS_METHOD should be direct', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($fsStatus)];
    }

    protected function getZipStatusForView()
    {
        $zipStatus = $this->statusHelper->getZipStatus();
        $textResponse = $zipStatus ? __('Enabled', 'visualcomposer') : __('The Zip extension is not installed.', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($zipStatus)];
    }

    protected function getCurlStatusForView()
    {
        $curlStatus = $this->statusHelper->getCurlStatus();
        $textResponse = $curlStatus ? curl_version()['version'] : __('Curl extension is not installed', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($curlStatus)];
    }

    protected function getAwsConnectionStatusForView()
    {
        $check = $this->statusHelper->getAwsConnection();
        $textResponse = $check ? __('Success', 'visualcomposer') : __('Connection with AWS was unsuccessful', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getAccountConnectionStatusForView()
    {
        $check = $this->statusHelper->getAccountConnection();
        $textResponse = $check ? __('Success', 'visualcomposer') : __('Connection with Account was unsuccessful', 'visualcomposer');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getPluginFolderStatusForView()
    {
        $check = VCV_PLUGIN_DIRNAME === 'visualcomposer';
        // translators: %s: plugin folder name.
        $textResponse = $check ? VCV_PLUGIN_DIRNAME : sprintf(__('Incorrect plugin folder name: %s. Plugin folder name must be ‘visualcomposer’', 'visualcomposer'), VCV_PLUGIN_DIRNAME);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getRenderArgs()
    {
        return [
            'refreshUrl' => $this->getRefreshUrl(),
            'phpVersion' => $this->getPhpVersionStatusForView(),
            'wpVersion' => $this->getWpVersionStatusForView(),
            'pluginFolder' => $this->getPluginFolderStatusForView(),
            'vcVersion' => $this->statusHelper->getVcvVersion(),
            'wpDebug' => $this->getWpDebugStatusForView(),
            'memoryLimit' => $this->getMemoryLimitStatusForView(),
            'postMaxSize' => $this->getPostMaxSizeStatusForView(),
            'maxInputNestingLevel' => $this->getMaxInputNestingLevelStatusForView(),
            'maxInputVars' => $this->getMaxInputVarsStatusForView(),
            'timeout' => $this->getTimeoutStatusForView(),
            'fileUploadSize' => $this->getUploadMaxFileSizeStatusForView(),
            'uploadDirAccess' => $this->getUploadDirAccessStatusForView(),
            'fsMethod' => $this->getFileSystemStatusForView(),
            'zipExt' => $this->getZipStatusForView(),
            'curlExt' => $this->getCurlStatusForView(),
            'account' => $this->getAccountConnectionStatusForView(),
            'aws' => $this->getAwsConnectionStatusForView(),
        ];
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $this->statusHelper->checkSystemStatusAndSetFlag();
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('System Status', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'manage_options',
            'isDashboardPage' => true,
            'hideInWpMenu' => true,
        ];
        $this->addSubmenuPage($page);
    }

    /**
     * If something fails, show an error message for that
     *
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param \VisualComposer\Modules\Settings\Pages\SystemStatus $systemStatus
     * @param Status $statusHelper
     */
    protected function addWarningNotice(Notice $noticeHelper, SystemStatus $systemStatus, Status $statusHelper)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $statusHelper->checkSystemStatusAndSetFlag();
        }
        $notices = $noticeHelper->all();
        if ($this->optionsHelper->get('systemCheckFailing')) {
            if (!isset($notices['systemCheckStatus'])) {
                $noticeHelper->addNotice(
                    'systemCheckStatus',
                    sprintf(
                        // translators: %s: link to system status page.
                        __(
                            'It seems that there is a problem with your server configuration that might affect Visual Composer. For more details, visit <a href="%s">System Status</a> page.',
                            'visualcomposer'
                        ),
                        esc_url(admin_url('admin.php?page=' . $systemStatus->slug))
                    ),
                    'error',
                    true
                );
            }
        } else {
            $noticeHelper->removeNotice('systemCheckStatus');
        }
    }

    protected function refreshStatusPage(Status $statusHelper)
    {
        $statusHelper->checkSystemStatusAndSetFlag();
        wp_safe_redirect(admin_url('admin.php?page=' . $this->slug));
        exit;
    }

    protected function getRefreshUrl()
    {
        $urlHelper = vchelper('Url');
        $nonceHelper = vchelper('Nonce');

        return $urlHelper->adminAjax(
            ['vcv-action' => 'vcv:settings:systemStatus:refresh:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
        );
    }
}
