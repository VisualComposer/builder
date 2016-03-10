<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper methods related to data manipulation
 */
class Data
{
    public function arraySearch($array, $column, $value)
    {
        if (!is_array($array)) {
            return false;
        }
        foreach ($array as $key => $innerArray) {
            $exists = isset($innerArray[ $column ]) && $innerArray[ $column ] == $value;
            if ($exists) {
                return $key;
            }
        }

        return false;
    }

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
