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
     * @return bool|string
     */
    public function getContents($filePath)
    {
        if (!$this->isFile($filePath)) {
            return false;
        }

        // get content from using file system
        return $this->getFileSystem()->get_contents($filePath);
    }

    public function exists($filePath)
    {
        return $this->getFileSystem()->exists($filePath);
    }

    public function isFile($filePath)
    {
        return $this->getFileSystem()->is_file($filePath);
    }

    public function isDir($filePath)
    {
        return $this->getFileSystem()->is_dir($filePath);
    }

    public function rename($oldName, $newName)
    {
        $this->checkDir(dirname($newName));
        return $this->getFileSystem()->move($oldName, $newName);
    }

    /**
     * @param $filePath
     * @param $contents
     *
     * @return false|int
     */
    public function setContents($filePath, $contents)
    {
        $this->checkDir(dirname($filePath));
        // set content using file system
        return $this->getFileSystem()->put_contents($filePath, $contents);
    }

    /**
     * Check does directory exist and if not create it
     *
     * @param $dirPath
     *
     * @return bool
     */
    public function checkDir($dirPath)
    {
        return wp_mkdir_p($dirPath);
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
        wp_delete_file($file);
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
        return wp_mkdir_p($dir);
    }

    /**
     * We use it to get file contents from url.
     *
     * @note We also check the case when link to file lead to local server upload folder like
     *
     * @return string
     */
    public function getRemoteContents($url)
    {
        $remoteContent = $this->doRequest($url);
        if ($remoteContent) {
            return $remoteContent;
        }

        // in case when file is on localhost but all other cases do not working for him
        // we try get file path to uploads from url and then get his content.
        $remoteContent = $this->getContentsUrlAsLocalUpload($url);
        if ($remoteContent) {
            return $remoteContent;
        }

        return false;
    }

    /**
     * Process request to specific url.
     *
     * @param string $url
     * @param array $args
     *
     * @return false|string
     */
    public function doRequest($url, $args = [])
    {
        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
            return false;
        }

        $responseCode = wp_remote_retrieve_response_code($response);

        // Do nothing, response code is okay.
        if ($responseCode === 200 || strpos($responseCode, '200') !== false) {
            $response = wp_remote_retrieve_body($response);
        } else {
            $response = false;
        }

        return $response;
    }

    /**
     * Try to convert url to wp uploads file path and then get content of it.
     *
     * @param string $url
     *
     * @return bool|string
     */
    public function getContentsUrlAsLocalUpload($url)
    {
        $basedirUpload = wp_upload_dir()['basedir'];
        $siteUrl = get_site_url();

        $file = str_replace($siteUrl . '/wp-content/uploads', $basedirUpload, $url);

        return $this->getContents($file);
    }
}
