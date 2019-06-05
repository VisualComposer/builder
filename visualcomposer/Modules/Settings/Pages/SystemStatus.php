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
        if (!vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            return;
        }

        $this->addFilter('vcv:settings:tabs', 'addSettingsTab', 10);

        $this->wpAddAction(
            'admin_menu',
            'addPage'
        );

        $this->wpAddAction(
            'admin_menu',
            'systemCheck'
        );

        $this->wpAddAction('admin_init', 'addWarningNotice');

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->wpAddAction(
            'in_admin_header',
            'addCss'
        );

        $this->addFilter('vcv:ajax:vcv:settings:systemStatus:refresh:adminNonce', 'refreshStatusPage');

        $this->statusHelper = $statusHelper;
        $this->optionsHelper = $optionsHelper;
    }

    /**
     * @param $tabs
     *
     * @return mixed
     */
    protected function addSettingsTab($tabs)
    {
        $tabs['vcv-system-status'] = [
            'name' => __('System Status', 'vcwb'),
        ];

        return $tabs;
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
        $textResponse = $checkVersion ? PHP_VERSION : sprintf(__('PHP version %s or greater (recommended 7 or greater)', 'vcwb'), VCV_REQUIRED_PHP_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    public function getWpVersionStatusForView()
    {
        $wpVersionCheck = $this->statusHelper->getWpVersionStatus();
        $textResponse = $wpVersionCheck ? get_bloginfo('version') : sprintf(__('WordPress version %s or greater', 'vcwb'), VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($wpVersionCheck)];
    }

    public function getWpDebugStatusForView()
    {
        $check = $this->statusHelper->getWpDebugStatus();

        $textResponse = $check ? __('WP_DEBUG is FALSE', 'vcwb') : __('WP_DEBUG is TRUE', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getPostMaxSize()
    {
        $postMaxSize = $this->statusHelper->postMaxSize();
        $postMaxSizeTest = $this->statusHelper->getPostMaxSizeStatus();

        if ($postMaxSize === '-1') {
            $postMaxSize = __('Unlimited', 'vcwb');
        }

        $textResponse = $postMaxSizeTest ? $postMaxSize : sprintf(__('Post max size should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultPostMaxSize(), $postMaxSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($postMaxSizeTest)];
    }

    public function getMemoryLimitStatusForView()
    {
        $memoryLimit = $this->statusHelper->getPhpVariable('memory_limit');
        $memoryLimitCheck = $this->statusHelper->getMemoryLimitStatus();

        if ($memoryLimit === '-1') {
            $memoryLimit = __('Unlimited', 'vcwb');
        }

        $textResponse = $memoryLimitCheck ? $memoryLimit : sprintf(__('Memory limit should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultMemoryLimit(), $memoryLimit);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($memoryLimitCheck)];
    }

    public function getPostMaxSizeStatusForView()
    {
        $postMaxSize = $this->statusHelper->getPhpVariable('post_max_size');
        $postMaxSizeCheck = $this->statusHelper->getPostMaxSizeStatus();

        if ($postMaxSize === '0') {
            $postMaxSize = __('Unlimited', 'vcwb');
        }

        $textResponse = $postMaxSizeCheck ? $postMaxSize : sprintf(__('post_max_size limit should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultPostMaxSize(), $postMaxSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($postMaxSizeCheck)];
    }

    public function getMaxInputNestingLevelStatusForView()
    {
        $maxInputNestingLevel = (int)$this->statusHelper->getPhpVariable('max_input_nesting_level');
        $maxInputNestingLevelCheck = $this->statusHelper->getMaxInputNestingLevelStatus();


        $textResponse = $maxInputNestingLevelCheck ? $maxInputNestingLevel : sprintf(__('max_input_nesting_level should be %s, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultMaxInputNestingLevel(), $maxInputNestingLevel);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxInputNestingLevelCheck)];
    }

    public function getMaxInputVarsStatusForView()
    {
        $maxInputVars = (int)$this->statusHelper->getPhpVariable('max_input_vars');
        $maxInputVarsCheck = $this->statusHelper->getMaxInputVarsStatus();


        $textResponse = $maxInputVarsCheck ? $maxInputVars : sprintf(__('max_input_vars should be %s, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultMaxInputVars(), $maxInputVars);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxInputVarsCheck)];
    }

    public function getTimeoutStatusForView()
    {
        $maxExecutionTime = (int)$this->statusHelper->getPhpVariable('max_execution_time');
        $maxExecutionTimeCheck = $this->statusHelper->getTimeoutStatus();
        $textResponse = $maxExecutionTimeCheck ? $maxExecutionTime : sprintf(__('Max execution time should be %sS, currently it is %sS', 'vcwb'), $this->statusHelper->getDefaultExecutionTime(), $maxExecutionTime);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxExecutionTimeCheck)];
    }

    public function getUploadMaxFileSizeStatusForView()
    {
        $maxFileSize = $this->statusHelper->getPhpVariable('upload_max_filesize');
        $maxFileSizeCheck = $this->statusHelper->getUploadMaxFileSizeStatus();
        $textResponse = $maxFileSizeCheck ? $maxFileSize : sprintf(__('File max upload size should be %sM, currently it is %s', 'vcwb'), $this->statusHelper->getDefaultFileUploadSize(), $maxFileSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($maxFileSizeCheck)];
    }

    protected function getUploadDirAccessStatusForView()
    {
        $accessCheck = $this->statusHelper->getUploadDirAccessStatus();
        $textResponse = $accessCheck ? __('Writable', 'vcwb') : __('Uploads directory is not writable', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($accessCheck)];
    }

    protected function getFileSystemStatusForView()
    {
        $fsStatus = $this->statusHelper->getFileSystemStatus();
        $textResponse = $fsStatus ? __('Direct', 'vcwb') : __('FS_METHOD should be direct', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($fsStatus)];
    }

    protected function getZipStatusForView()
    {
        $zipStatus = $this->statusHelper->getZipStatus();
        $textResponse = $zipStatus ? __('Enabled', 'vcwb') : __('Zip extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($zipStatus)];
    }

    protected function getCurlStatusForView()
    {
        $curlStatus = $this->statusHelper->getCurlStatus();
        $textResponse = $curlStatus ? curl_version()['version'] : __('Curl extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($curlStatus)];
    }

    protected function getAwsConnectionStatusForView()
    {
        $check = $this->statusHelper->getAwsConnection();
        $textResponse = $check ? __('Success', 'vcwb') : __('Connection with AWS was unsuccessful', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getAccountConnectionStatusForView()
    {
        $check = $this->statusHelper->getAccountConnection();
        $textResponse = $check ? __('Success', 'vcwb') : __('Connection with Account was unsuccessful', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    protected function getRenderArgs()
    {
        return [
            'refreshUrl' => $this->getRefreshUrl(),
            'phpVersion' => $this->getPhpVersionStatusForView(),
            'wpVersion' => $this->getWpVersionStatusForView(),
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
        $urlHelper = vchelper('Url');
        wp_register_style(
            'vcv:wpUpdate:style',
            $urlHelper->to('public/dist/wpUpdate.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpUpdate:style');

        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
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

    /**
     * If something fails, show a error message for that
     *
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param \VisualComposer\Modules\Settings\Pages\SystemStatus $systemStatus
     */
    protected function addWarningNotice(Notice $noticeHelper, SystemStatus $systemStatus)
    {
        $notices = $noticeHelper->all();
        if ($this->optionsHelper->get('systemCheckFailing')) {
            if (!isset($notices['systemCheckStatus'])) {
                $noticeHelper->addNotice(
                    'systemCheckStatus',
                    sprintf(
                        __(
                            'It seems that you have a problem with your server configuration that might affect Visual Composer. For more details, please visit <a href="%s">system status</a> page.',
                            'vcwb'
                        ),
                        admin_url('admin.php?page=' . $systemStatus->slug)
                    ),
                    'error',
                    true
                );
            }
        } else {
            $noticeHelper->removeNotice('systemCheckStatus');
        }
    }

    protected function addCss()
    {
        evcview('settings/partials/system-status-css');
    }

    protected function refreshStatusPage(Status $statusHelper)
    {
        $statusHelper->checkSystemStatusAndSetFlag();
        wp_redirect(admin_url('admin.php?page=' . $this->slug));
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
