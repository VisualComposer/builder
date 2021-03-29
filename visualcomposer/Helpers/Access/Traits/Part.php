<?php

namespace VisualComposer\Helpers\Access\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class Access.
 */
trait Part
{
    /**
     * @var string
     */
    protected static $partNamePrefix = 'vcv_access_rules__';

    /**
     * Current working part of access system.
     * @var string
     */
    protected $part;

    /**
     * Get part for role.
     *
     * @return bool
     */
    public function getPart()
    {
        return $this->part;
    }

    /**
     * @return string
     */
    public function getStateKey()
    {
        return self::$partNamePrefix . $this->getPart();
    }

    /**
     * @param $data
     *
     * @return $this
     */
    public function checkState($data)
    {
        if ($this->getValidAccess()) {
            $this->setValidAccess($this->getState() === $data);
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function checkStateAny()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->checkMulti([$this, 'checkState'], true, $args);
        }

        return $this;
    }

    public function getAvailableParts()
    {
        return vcfilter(
            'vcv:access:role:parts',
            [
                'post_types',
            ]
        );
    }
}
