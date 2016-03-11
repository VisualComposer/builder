<?php

namespace VisualComposer\Helpers\WordPress;

/**
 * Class File
 * @package VisualComposer\Helpers\WordPress
 */
class File
{
    /**
     * @param $filePath
     *
     * @return mixed
     */
    public function getContents($filePath)
    {
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
