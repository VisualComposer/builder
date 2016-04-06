<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to data manipulation
 * Class Data
 * @package VisualComposer\Helpers
 */
class Data implements Helper
{
    /**
     * @param $array
     * @param $column
     * @param $value
     *
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
     *
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
}
