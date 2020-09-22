<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Application;
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Access\Role as AccessFactory;

/**
 * Available by vchelper('AccessCurrentUser').
 * Provides API to check access for current logged in used.
 * Class Access.
 */
class CurrentUser extends AccessFactory implements Helper
{
    /**
     * @param $part
     *
     * @param bool $reset
     *
     * @return $this
     */
    public function part($part, $reset = false)
    {
        if ($reset) {
            $this->reset();
        }
        //!!!
        $this->part = $part;
        // we also check for user "logged_in" status.
        require_once ABSPATH . "wp-includes/pluggable.php";
        $isUserLoggedIn = is_user_logged_in();
        $this->setValidAccess($isUserLoggedIn && $this->getValidAccess()); // send current status to upper level.
        // Init user role
        $this->getRole();

        return $this;
    }

    /**
     * @param $callback
     * @param $valid
     * @param $argsList
     *
     * @return $this
     */
    public function wpMulti($callback, $valid, $argsList)
    {
        if ($this->getValidAccess()) {
            require_once ABSPATH . "wp-includes/pluggable.php";
            $access = !$valid;
            /** @var Application $vcapp */
            $vcapp = vcapp();
            foreach ($argsList as &$args) {
                if (!is_array($args)) {
                    $args = [$args];
                }
                array_unshift($args, 'current_user_can');
                $this->setValidAccess(true);
                $vcapp->call($callback, $args);
                if ($valid === $this->getValidAccess()) {
                    $access = $valid;
                    break;
                }
            }
            $this->setValidAccess($access);
        }

        return $this;
    }

    /**
     * Check Wordpress capability. Should be valid one cap at least.
     *
     * @return $this
     */
    public function wpAny()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->wpMulti([$this, 'check'], true, $args);
        }

        return $this;
    }

    /**
     * Check Wordpress capability. Should be valid all caps.
     *
     * @return $this
     */
    public function wpAll()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->wpMulti([$this, 'check'], false, $args);
        }

        return $this;
    }

    /**
     * Get capability for current user.
     *
     * @param $rule
     *
     * @return bool
     */
    public function getCapRule($rule)
    {
        $roleRule = $this->getStateKey() . '/' . $rule;

        return current_user_can($roleRule);
    }

    /**
     * Add capability to role.
     *
     * @param $rule
     * @param bool $value
     *
     * @return $this
     */
    public function setCapRule($rule, $value = true)
    {
        $roleRule = $this->getStateKey() . '/' . $rule;

        wp_get_current_user()->add_cap($roleRule, $value);

        return $this;
    }

    /**
     * @return \WP_Role
     */
    public function getRole()
    {
        if (!$this->roleName && function_exists('wp_get_current_user')) {
            $user = wp_get_current_user();
            require_once ABSPATH . "/wp-admin/includes/user.php";
            $userRoles = array_intersect(array_values($user->roles), array_keys(get_editable_roles()));
            $this->roleName = reset($userRoles);
            $this->role = get_role($this->roleName);
        }

        return $this->role;
    }
}
