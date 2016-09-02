<?php

namespace VisualComposer\Helpers;

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
}
