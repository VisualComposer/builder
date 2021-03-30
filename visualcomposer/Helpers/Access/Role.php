<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Illuminate\Support\Immutable;
use VisualComposer\Helpers\Access\Traits\Access as AccessFactory;
use VisualComposer\Helpers\Access\Traits\Part;

/**
 * Available by vchelper('AccessRole').
 * Provides API for specific role for checks & access.
 *
 * Class Access.
 */
class Role implements Helper, Immutable
{
    use AccessFactory;
    use Part;


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
     * @param string $part
     *
     * @return $this
     * @throws \Exception
     */
    public function part($part)
    {
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
     * Get state of the Vc access rules part.
     *
     * @return mixed;
     * @throws \Exception
     */
    public function getState()
    {
        $role = $this->getRole();
        if ($role->name === 'administrator') {
            $state = true;
        } elseif ($role->name === 'subscriber') {
            $state = false;
        } else {
            $state = null;
            if ($role && isset($role->capabilities[ $this->getStateKey() ])) {
                $state = $role->capabilities[ $this->getStateKey() ];
            }
        }

        return vcfilter('vcv:role:getState:accessWith:' . $this->getPart(), $state, $this->getRole(), $this->getPart());
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
        if ($this->getRole()) {
            if (is_null($value)) {
                $this->getRole()->remove_cap($this->getStateKey());
            } else {
                $this->getRole()->add_cap($this->getStateKey(), $value);
            }
        }

        return $this;
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
            // Administrators have all access always
            if ($this->getRole()->name === 'administrator') {
                $this->setValidAccess(true);

                return $this;
            }
            if ($this->getRole()->name === 'subscriber') {
                $this->setValidAccess(false);

                return $this;
            }
            $rule = $this->updateMergedCaps($rule);

            if (true === $checkState) {
                $state = $this->getState();
                $return = $state === true;
                if (is_bool($state)) {
                    $return = $state;
                } elseif ('' !== $rule) {
                    $return = $this->getCapRule($rule);
                }
            } else {
                $return = $this->getCapRule($rule);
            }
            $this->setValidAccess($return);
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
        $rule = $this->getStateKey() . '_' . $rule;

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
        $roleRule = $this->getStateKey() . '_' . $rule;
        $this->getRole() && $this->getRole()->add_cap($roleRule, $value);

        return $this;
    }

    /**
     * @return null|\WP_Role
     * @throws \Exception
     */
    public function getRole()
    {
        if (!$this->getRoleName()) {
            throw new \Exception('roleName for role_manager is not set, please use ->who(roleName) method to set!');
        }

        return get_role($this->getRoleName());
    }
}
