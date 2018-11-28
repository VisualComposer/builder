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

    protected $defaultFileUploadSize = 5; //In MB

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

    public function getStatusCssClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    public function getWpVersionStatus()
    {
        return $this->checkVersion(VCV_REQUIRED_BLOG_VERSION, get_bloginfo('version'));
    }

    public function getVcvVersion()
    {
        return VCV_VERSION;
    }

    public function getWpDebugStatus()
    {
        return !WP_DEBUG;
    }

    public function getMemoryLimit()
    {
        return ini_get('memory_limit');
    }

    public function getMemoryLimitStatus()
    {
        $memoryLimit = $this->getMemoryLimit();
        if ($memoryLimit === -1) {
            return true;
        }

        return ($this->convertMbToBytes($memoryLimit) >= $this->defaultMemoryLimit * 1024 * 1024);
    }

    public function getMaxExecutionTime()
    {
        return (int)ini_get('max_execution_time');
    }

    public function getTimeoutStatus()
    {
        return $this->getMaxExecutionTime() >= $this->defaultExecutionTime;
    }

    public function getMaxUploadFileSize()
    {
        return ini_get('upload_max_filesize');
    }

    public function getUploadMaxFileSizeStatus()
    {
        $maxFileSize = $this->getMaxUploadFileSize();

        return $this->convertMbToBytes($maxFileSize) >= $this->defaultFileUploadSize;
    }

    public function getUploadDirAccessStatus()
    {
        return is_writable(wp_upload_dir()['basedir']);
    }

    public function getFileSystemStatus()
    {
        return !(defined('FS_METHOD') && FS_METHOD !== 'direct');
    }

    public function getZipStatus()
    {
        return class_exists('ZipArchive') || class_exists('PclZip');
    }

    public function getCurlStatus()
    {
        return extension_loaded('curl');
    }

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
}
