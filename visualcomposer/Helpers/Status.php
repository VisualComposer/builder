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

    public function checkVersion($mustHaveVersion, $versionToCheck)
    {
        return !version_compare($mustHaveVersion, $versionToCheck, '>');
    }

    public function getPhpVersionResponse()
    {
        $checkVersion = $this->checkVersion(VCV_REQUIRED_PHP_VERSION, PHP_VERSION);

        $textResponse = $checkVersion ? PHP_VERSION : sprintf('PHP version %s or greater (recommended 7 or greater)', VCV_REQUIRED_PHP_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    public function getWpVersionResponse()
    {
        $wpVersion = get_bloginfo('version');
        $checkVersion = $this->checkVersion(VCV_REQUIRED_BLOG_VERSION, $wpVersion);

        $textResponse = $checkVersion ? $wpVersion : sprintf('WordPress version %s or greater', VCV_REQUIRED_BLOG_VERSION);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($checkVersion)];
    }

    public function getStatusCssClass($status)
    {
        return $status ? 'good' : 'bad';
    }

    public function getVersionResponse()
    {
        return VCV_VERSION;
    }

    public function getWpDebugResponse()
    {
        $check = !WP_DEBUG;

        $textResponse = $check ? 'Enabled' : 'WP_DEBUG is TRUE';

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getMemoryLimit()
    {
        $memoryLimit = ini_get('memory_limit');
        if ($memoryLimit === -1) {
            $check = true;
        } else {
            $memoryLimitToBytes = $this->convertMbToBytes($memoryLimit);
            $check = ($memoryLimitToBytes >= $this->defaultMemoryLimit * 1024 * 1024);
        }

        $textResponse = $check ? $memoryLimit : sprintf(__('Memory limit should be %sM, currently it is %s', 'vcwb'), $this->defaultMemoryLimit, $memoryLimit);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getTimeout()
    {
        $maxExecutionTime = (int)ini_get('max_execution_time');
        $check = false;
        if ($maxExecutionTime >= $this->defaultExecutionTime) {
            $check = true;
        }

        $textResponse = $check ? $maxExecutionTime : sprintf(__('Max execution time should be %sS, currently it is %sS', 'vcwb'), $this->defaultExecutionTime, $maxExecutionTime);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getUploadMaxFilesize()
    {
        $maxFileSize = ini_get('upload_max_filesize');
        $maxFileSizeToBytes = $this->convertMbToBytes($maxFileSize);
        $check = false;

        if ($maxFileSizeToBytes >= $this->defaultFileUploadSize) {
            $check = true;
        }

        $textResponse = $check ? $maxFileSize : sprintf(__('File max upload size should be %sM, currently it is %s', 'vcwb'), $this->defaultFileUploadSize, $maxFileSize);

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getUploadDirAccess()
    {
        $wpUploadDir = wp_upload_dir()['basedir'];
        $check = is_writable($wpUploadDir);

        $textResponse = $check ? 'Writable' : __('Uploads directory is not writable', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getFileSystemMethod()
    {
        $check = true;
        if (defined('FS_METHOD') && FS_METHOD !== 'direct') {
            $check = false;
        }

        $textResponse = $check ? 'Direct' : __('FS_METHOD should be direct', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getZipExtension()
    {
        $check = false;
        if (class_exists('ZipArchive') || class_exists('PclZip')) {
            $check = true;
        }

        $textResponse = $check ? 'Enabled' : __('Zip extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
    }

    public function getCurlExtension()
    {
        $check = false;
        if (extension_loaded('curl')) {
            $check = true;
        }

        $textResponse = $check ? curl_version()['version'] : __('Curl extension is not installed', 'vcwb');

        return ['text' => $textResponse, 'status' => $this->getStatusCssClass($check)];
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
