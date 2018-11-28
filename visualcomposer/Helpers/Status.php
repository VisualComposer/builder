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

    /** @var \VisualComposer\Helpers\Options */
    private $optionsHelper;

    public function __construct(Options $optionsHelper)
    {
        $this->optionsHelper = $optionsHelper;
    }

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
     * @return string
     */
    public function getMemoryLimit()
    {
        return ini_get('memory_limit');
    }

    /**
     * @return bool
     */
    public function getMemoryLimitStatus()
    {
        $memoryLimit = $this->getMemoryLimit();
        if ($memoryLimit === -1) {
            return true;
        }

        return ($this->convertMbToBytes($memoryLimit) >= $this->defaultMemoryLimit * 1024 * 1024);
    }

    /**
     * @return int
     */
    public function getMaxExecutionTime()
    {
        return (int)ini_get('max_execution_time');
    }

    /**
     * @return bool
     */
    public function getTimeoutStatus()
    {
        $maxExecutionTime = $this->getMaxExecutionTime();
        if ($maxExecutionTime === 0) {
            return true;
        }

        return $maxExecutionTime >= $this->defaultExecutionTime;
    }

    /**
     * @return string
     */
    public function getMaxUploadFileSize()
    {
        return ini_get('upload_max_filesize');
    }

    /**
     * @return bool
     */
    public function getUploadMaxFileSizeStatus()
    {
        return $this->convertMbToBytes($this->getMaxUploadFileSize()) >= $this->defaultFileUploadSize;
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
        if (preg_match('/^(\d+)(.)$/', $size, $matches)) {
            if ($matches[2] === 'G') {
                $size = (int)$matches[1] * 1024 * 1024 * 1024;
            } elseif ($matches[2] === 'M') {
                $size = (int)$matches[1] * 1024 * 1024;
            } elseif ($matches[2] === 'K') {
                $size = (int)$matches[1] * 1024;
            }
        }

        return $size;
    }

    public function getSystemStatus()
    {
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
        ];

        foreach ($results as $result) {
            if ($result === false) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return void
     */
    public function checkSystemStatusAndSetFlag()
    {
        $systemStatus = $this->getSystemStatus();

        if (!$systemStatus) {
            $this->optionsHelper->set('systemCheckFailing', true);
        } else {
            $this->optionsHelper->delete('systemCheckFailing');
        }
    }
}
