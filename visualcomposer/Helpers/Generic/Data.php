<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper methods related to data manipulation
 * Class Data
 * @package VisualComposer\Helpers\Generic
 */
class Data
{
    /**
     * @param $array
     * @param $column
     * @param $value
     * @return bool|int|string
     */
    public function arraySearch($array, $column, $value)
    {
        if (!is_array($array)) {
            return false;
        }
        foreach ($array as $key => $innerArray) {
            $exists = isset($innerArray[ $column ]) && $innerArray[ $column ] == $value;
            if ($exists) {
                return $innerArray;
            }
        }

        return false;
    }

    /**
     * @param $array
     * @param $column
     * @param bool $returnValue
     * @return bool|int|string
     */
    public function arraySearchKey($array, $column, $returnValue = false)
    {
        if (!is_array($array)) {
            return false;
        }
        foreach ($array as $key => $innerArray) {
            $exists = isset($innerArray[ $column ]);
            if ($exists) {
                if ($returnValue) {
                    return $innerArray[ $column ];
                } else {
                    return $key;
                }
            }
        }

        return false;
    }

    /**
     * Return random string
     *
     * @param int $length
     *
     * @return string
     */
    public function randomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $len = strlen($characters);
        $str = '';
        for ($i = 0; $i < $length; $i++) {
            $str .= $characters[ rand(0, $len - 1) ];
        }

        return $str;
    }
}
