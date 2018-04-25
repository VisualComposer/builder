<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Access\Traits\Access as AccessFactory;

/**
 * Available by vchelper('AccessRole').
 * Provides API for specific role for checks & access.
 *
 * Class Access.
 */
class Role implements Helper
{
    use AccessFactory;

    /**
     * Current RoleName (administrator/contributor..).
     * @var string
     */
    protected $roleName;

    /**
     * Current get_role(from RoleName).
     * @var \WP_Role
     */
    protected $role;

    /**
     * Current working part of access system.
     * @var string
     */
    protected $part;

    /**
     * @var string
     */
    protected static $partNamePrefix = 'vcv:access:rules:';

    /**
     * @var array
     */
    protected $mergedCaps = [
    ];

    /**
     * @param $part
     *
     * @param bool $reset
     *
     * @return $this
     * @throws \Exception
     */
    public function part($part, $reset = false)
    {
        if ($reset) {
            $this->reset();
        }
        $roleName = $this->getRoleName();

        if (!$roleName) {
            throw new \Exception('roleName for Role\Access is not set, please use ->who(roleName) method to set!');
        }

        $this->part = $part;
        $this->setValidAccess($this->getValidAccess());

        return $this;
    }

    /**
     * Set role to get access to data.
     *
     * @param $roleName
     *
     * @return $this
     */
    public function who($roleName)
    {
        $this->roleName = $roleName;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getRoleName()
    {
        return $this->roleName;
    }

    /**
     * Set role name.
     *
     * @param $roleName
     */
    public function setRoleName($roleName)
    {
        $this->roleName = $roleName;
    }

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
     * Get state of the Vc access rules part.
     *
     * @return mixed;
     * @throws \Exception
     */
    public function getState()
    {
        $role = $this->getRole();
        $state = null;
        if ($role && isset($role->capabilities, $role->capabilities[ $this->getStateKey() ])) {
            $state = $role->capabilities[ $this->getStateKey() ];
        }

        return apply_filters('vcv:role:getState:accessWith' . $this->getPart(), $state, $this->getRole());
    }

    /**
     * Set state for full part.
     *
     * State can have 3 values:
     * true - all allowed under this part;
     * false - all disabled under this part;
     * string|'custom' - custom settings. It means that need to check exact capability.
     *
     * @param bool $value
     *
     * @throws \Exception
     */
    public function setState($value = true)
    {
        $this->getRole() && $this->getRole()->add_cap($this->getStateKey(), $value);
    }

    /**
     * Can user do what he doo.
     * Any rule has three types of state: true, false, string.
     *
     * @param string $rule
     * @param bool|true $checkState
     *
     * @return $this
     * @throws \Exception
     */
    public function can($rule = '', $checkState = true)
    {
        $part = $this->getPart();
        if (empty($part)) {
            throw new \Exception('partName for Role\Access is not set, please use ->part(partName) method to set!');
        }
        if (null === $this->getRole()) {
            $this->setValidAccess(is_super_admin());
        } elseif ($this->getValidAccess()) {
            //   // YES it is hard coded :)
            //   if ('administrator' === $this->getRole()->name && 'settings' === $part
            //       && ('vcv-roles-tab' === $rule
            //           || 'vcv-license-tab' === $rule)
            //   ) {
            //       $this->setValidAccess(true);
            //
            //       return $this;
            //  }
            $rule = $this->updateMergedCaps($rule);

            if (true === $checkState) {
                $state = $this->getState();
                $return = false !== $state;
                if (null === $state) {
                    $return = true;
                } elseif (is_bool($state)) {
                    $return = $state;
                } elseif ('' !== $rule) {
                    $return = $this->getCapRule($rule);
                }
            } else {
                $return = $this->getCapRule($rule);
            }
            //    $return = apply_filters('vcv:role:can:accessWith' . $part, $return, $this->getRole(), $rule);
            //    $return = apply_filters('vcv:role:can:accessWith' . $part . ':' . $rule, $return, $this->getRole());
            $this->setValidAccess($return);
        }

        return $this;
    }

    /**
     * Can user do what he do.
     * Any rule has three types of state: true,false, string.
     *
     * @return $this
     */
    public function canAny()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->checkMulti([$this, 'can'], true, $args);
        }

        return $this;
    }

    /**
     * Can user do what he do.
     * Any rule has three types of state: true,false, string.
     */
    public function canAll()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->checkMulti([$this, 'can'], false, $args);
        }

        return $this;
    }

    /**
     * Get capability for role.
     *
     * @param $rule
     *
     * @return bool
     * @throws \Exception
     */
    public function getCapRule($rule)
    {
        $rule = $this->getStateKey() . '/' . $rule;

        return $this->getRole() ? $this->getRole()->has_cap($rule) : false;
    }

    /**
     * Add capability to role.
     *
     * @param $rule
     * @param bool $value
     *
     * @return $this
     * @throws \Exception
     */
    public function setCapRule($rule, $value = true)
    {
        $roleRule = $this->getStateKey() . '/' . $rule;
        $this->getRole() && $this->getRole()->add_cap($roleRule, $value);

        return $this;
    }

    /**
     * Get all capability for this part.
     * @throws \Exception
     */
    public function getAllCaps()
    {
        $role = $this->getRole();
        $caps = [];
        if ($role) {
            $role = apply_filters('vcv:role:getAllCaps:role', $role);
            if (isset($role->capabilities) && is_array($role->capabilities)) {
                foreach ($role->capabilities as $key => $value) {
                    if (preg_match('/^' . $this->getStateKey() . '\//', $key)) {
                        $rule = preg_replace('/^' . $this->getStateKey() . '\//', '', $key);
                        $caps[ $rule ] = $value;
                    }
                }
            }
        }

        return $caps;
    }

    /**
     * @return null|\WP_Role
     * @throws \Exception
     */
    public function getRole()
    {
        if (!$this->role) {
            if (!$this->getRoleName()) {
                throw new \Exception('roleName for role_manager is not set, please use ->who(roleName) method to set!');
            }
            $this->role = get_role($this->getRoleName());
        }

        return $this->role;
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

    /**
     * Return access value.
     *
     * @return string
     */
    public function __toString()
    {
        return (string)$this->get(true);
    }

    /**
     * @param $rule
     *
     * @return mixed
     */
    public function updateMergedCaps($rule)
    {
        if (isset($this->mergedCaps[ $rule ])) {
            return $this->mergedCaps[ $rule ];
        }

        return $rule;
    }

    /**
     * @return array
     */
    public function getMergedCaps()
    {
        return $this->mergedCaps;
    }
}
