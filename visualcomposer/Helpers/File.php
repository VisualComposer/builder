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
        if (!is_file($filePath)) {
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
}
