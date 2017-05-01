<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;

//use VisualComposer\Framework\Illuminate\Support\Helper;
//use VisualComposer\Framework\Illuminate\Support\Module;

class Differ extends Container /*implements Helper*/
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function compare($key, $new)
    {
        if (!isset($this->data[ $key ])) {
            return $new;
        }

        return array_unique(array_merge($this->data[ $key ], $new));
    }

    public function set($key, $new)
    {
        $this->data[ $key ] = $new;
    }

    public function get($key = '')
    {
        return $key ? $this->data[ $key ] : $this->data;
    }
}
