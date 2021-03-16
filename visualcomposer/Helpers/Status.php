<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

class Status implements Helper
{
    protected $defaultExecutionTime = 30; //In seconds

    protected $defaultMemoryLimit = 256; //In MB

    protected $defaultFileUploadSize = 5;  //In MB

    protected $defaultPostMaxSize = 8;  //In MB

    protected $defaultMaxInputVarsStatus = 1000;

    protected $defaultMaxInputNestingLevel = 64;

    /**
     * @return int
     */
    public function getDefaultExecutionTime()
    {
        return $this->defaultExecutionTime;
    }

    /**
     * @return int
     */
    public function getDefaultMemoryLimit()
    {
        return $this->defaultMemoryLimit;
    }

    /**
     * @return int
     */
    public function getDefaultPostMaxSize()
    {
        return $this->defaultPostMaxSize;
    }

    /**
     * @return int
     */
    public function getDefaultMaxInputVarsStatus()
    {
        return $this->defaultMaxInputVarsStatus;
    }

    /**
     * @return int
     */
    public function getDefaultMaxInputNestingLevel()
    {
        return $this->defaultMaxInputNestingLevel;
    }

    /**
     * @return int
     */
    public function getDefaultFileUploadSize()
    {
        return $this->defaultFileUploadSize;
    }

    public function checkVersion($mustHaveVersion, $versionToCheck)
    {
        return !version_compare($mustHaveVersion, $versionToCheck, '>');
    }

    /**
     * @return bool
     */
    public function getPhpVersionStatus()
    {
        return $this->checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION);
    }

    /**
     * @return bool
     */
    public function getWpVersionStatus()
    {
        return $this->checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'));
    }

    /**
     * @return string
     */
    public function getVcvVersion()
    {
        return VCV_VERSION;
    }

    /*
     *
     */
    public function getWpDebugStatus()
    {
        return !WP_DEBUG;
    }

    /**
     * @param $name
     *
     * @return string
     */
    public function getPhpVariable($name)
    {
        return ini_get($name);
    }

    /**
     * @return bool
     */
    public function getMemoryLimitStatus()
    {
        $memoryLimit = $this->getPhpVariable('memory_limit');
        if ($memoryLimit === '-1') {
            return true;
        }

        return ($this->convertMbToBytes($memoryLimit) >= $this->defaultMemoryLimit * 1024 * 1024);
    }

    /**
     * @return bool
     */
    public function getTimeoutStatus()
    {
        $maxExecutionTime = (int)$this->getPhpVariable('max_execution_time');
        if ($maxExecutionTime === 0) {
            return true;
        }

        return $maxExecutionTime >= $this->defaultExecutionTime;
    }

    /**
     * @return bool
     */
    public function getUploadMaxFileSizeStatus()
    {
        return $this->convertMbToBytes($this->getPhpVariable('upload_max_filesize')) >= $this->defaultFileUploadSize;
    }

    /**
     * @return bool
     */
    public function getPostMaxSizeStatus()
    {
        $postMaxSize = $this->getPhpVariable('post_max_size');
        if ($postMaxSize === '0') {
            return true;
        }

        return ($this->convertMbToBytes($postMaxSize) >= $this->defaultPostMaxSize * 1024 * 1024);
    }

    /**
     * @return bool
     */
    public function getMaxInputNestingLevelStatus()
    {
        $maxInputNestingLevel = (int)$this->getPhpVariable('max_input_nesting_level');
        if ($maxInputNestingLevel >= $this->defaultMaxInputNestingLevel) {
            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function getMaxInputVarsStatus()
    {
        $maxInputNestingLevel = (int)$this->getPhpVariable('max_input_vars');
        if ($maxInputNestingLevel >= $this->defaultMaxInputVarsStatus) {
            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function getUploadDirAccessStatus()
    {
        return is_writable(wp_upload_dir()['basedir']);
    }

    /**
     * @return bool
     */
    public function getFileSystemStatus()
    {
        return !(defined('FS_METHOD') && FS_METHOD !== 'direct');
    }

    /**
     * @return bool
     */
    public function getZipStatus()
    {
        return class_exists('ZipArchive') || class_exists('PclZip');
    }

    /**
     * @return bool
     */
    public function getCurlStatus()
    {
        return extension_loaded('curl');
    }

    /**
     * @param $size
     *
     * @return float|int
     */
    public function convertMbToBytes($size)
    {
        $size = strtolower($size);

        if (preg_match('/^(\d+)(.)$/', $size, $matches)) {
            if ($matches[2] === 'g') {
                $size = (int)$matches[1] * 1024 * 1024 * 1024;
            } elseif ($matches[2] === 'm') {
                $size = (int)$matches[1] * 1024 * 1024;
            } elseif ($matches[2] === 'k') {
                $size = (int)$matches[1] * 1024;
            }
        }

        return $size;
    }

    /**
     * @return bool
     */
    public function getAwsConnection()
    {
        $request = wp_remote_get(
            'https://s3.us-west-2.amazonaws.com/cdn.hub.visualcomposer.com/vcwb-bundles/status.json',
            [
                'timeout' => 30,
            ]
        );
        if (!vcIsBadResponse($request)) {
            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function getAccountConnection()
    {
        $body = [
            'type' => 'ping',
        ];
        $url = vcvenv('VCV_HUB_URL');
        $url = vchelper('Url')->query($url, $body);
        $result = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        if (wp_remote_retrieve_response_code($result) === 200) {
            return true;
        }

        return false;
    }

    public function getSystemStatus()
    {
        if (
            function_exists('current_user_can') && function_exists('wp_raise_memory_limit')
            && current_user_can(
                'manage_options'
            )
        ) {
            wp_raise_memory_limit('admin');
        }
        $results = [
            $this->getMemoryLimitStatus(),
            $this->getFileSystemStatus(),
            $this->getCurlStatus(),
            $this->getPhpVersionStatus(),
            $this->getTimeoutStatus(),
            $this->getZipStatus(),
            $this->getWpDebugStatus(),
            $this->getWpVersionStatus(),
            $this->getUploadDirAccessStatus(),
            $this->getUploadMaxFileSizeStatus(),
            $this->getAwsConnection(),
            $this->getAccountConnection(),
            $this->getPostMaxSizeStatus(),
            $this->getMaxInputNestingLevelStatus(),
            $this->getMaxInputVarsStatus(),
        ];

        foreach ($results as $result) {
            if ($result === false) {
                return false;
            }
        }

        return true;
    }

    public function checkSystemStatusAndSetFlag()
    {
        $optionsHelper = vchelper('Options');
        $systemStatus = $this->getSystemStatus();

        if (!$systemStatus) {
            $optionsHelper->set('systemCheckFailing', true);
        } else {
            $optionsHelper->delete('systemCheckFailing');
        }
    }
}
