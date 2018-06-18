<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class File.
 */
class File implements Helper
{
    /**
     * @param $filePath
     *
     * @return mixed
     */
    public function getContents($filePath)
    {
        if (!$this->isFile($filePath)) {
            return false;
        }

        return file_get_contents($filePath);
    }

    /**
     * @param $filePath
     * @param $contents
     *
     * @return mixed
     */
    public function setContents($filePath, $contents)
    {
        return file_put_contents($filePath, $contents);
    }

    /**
     * Check does file exist
     *
     * @param $filePath
     *
     * @return bool
     */
    public function isFile($filePath)
    {
        return is_file($filePath);
    }

    /**
     * Check does directory exist
     *
     * @param $dirPath
     *
     * @return bool
     */
    public function isDir($dirPath)
    {
        return is_dir($dirPath);
    }

    /**
     * Check does directory exists and if not create it
     *
     * @param $dirPath
     * @param int $permissions
     *
     * @return bool
     */
    public function checkDir($dirPath, $permissions = 0777)
    {
        return !$this->isDir($dirPath) ? mkdir($dirPath, $permissions, true) : true;
    }

    public function download($url)
    {
        require_once(ABSPATH . '/wp-admin/includes/file.php');
        $downloadedArchive = download_url($url);

        return $downloadedArchive;
    }

    public function unzip($file, $destination, $overwrite = false)
    {
        $fileSystem = $this->getFileSystem();
        if (!$fileSystem) {
            return false;
        }
        if ($overwrite && is_dir($destination)) {
            $fileSystem->delete($destination);
        }
        $result = unzip_file($file, $destination);

        return $result;
    }

    /**
     * @return \WP_Filesystem_Base|bool
     */
    public function getFileSystem()
    {
        // @codingStandardsIgnoreLine
        global $wp_filesystem;
        $status = true;
        // @codingStandardsIgnoreLine
        if (!$wp_filesystem || !is_object($wp_filesystem)) {
            require_once(ABSPATH . '/wp-admin/includes/file.php');
            $status = WP_Filesystem(false, false, true);
        }

        // @codingStandardsIgnoreLine
        return $status ? $wp_filesystem : false;
    }

    public function removeDirectory($dir, $recursive = true)
    {
        $fileSystem = $this->getFileSystem();
        if (!$fileSystem) {
            return false;
        }

        return $fileSystem->rmdir($dir, $recursive);
    }

    public function removeFile($file)
    {
        return wp_delete_file($file);
    }

    public function copyDirectory($from, $to, $overwrite = true)
    {
        $fileSystem = $this->getFileSystem();
        if (!$fileSystem) {
            return false;
        }
        if ($overwrite) {
            $this->removeDirectory($to);
        }
        $this->createDirectory($to);

        return copy_dir($from, $to);
    }

    public function copyFile($from, $to, $overwrite = true)
    {
        $fileSystem = $this->getFileSystem();
        if (!$fileSystem) {
            return false;
        }

        return $fileSystem->copy($from, $to, $overwrite);
    }

    public function createDirectory($dir)
    {
        return $this->getFileSystem()->mkdir($dir);
    }
}
