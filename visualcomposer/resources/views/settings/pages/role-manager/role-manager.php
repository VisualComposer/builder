<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$editableRoles = get_editable_roles();
//ksort($editableRoles);
$roleAccessHelper = vchelper('AccessRole');
$accessParts = $roleAccessHelper->getAvailableParts();
?>
<style>
  .vcv-role-manager-capabilities-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .vcv-role-manager-capabilities-form--item {
    background-color: #fff;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  }

  .vcv-role-manager-capabilities-form--item--heading {
    padding: 16px;
    font-family: 'Montserrat', sans-serif;
    line-height: 22px;
    font-weight: 600;
    font-size: 18px;
    color: #515162;
    position: relative;
    cursor: pointer;
  }

  .vcv-role-manager-capabilities-form--item--heading::after {
    position: absolute;
    right: 16px;
    font-family: 'VC-Icons', serif;
    font-size: 18px;
    width: 18px;
    height: 18px;
    content: "\25be";
    color: #C6CBD4;
  }

  .vcv-role-manager-capabilities-form--item--active .vcv-role-manager-capabilities-form--item--heading::after {
    content: "\25b4";
  }

  .vcv-role-manager-capabilities-form--item--content {
    padding: 16px;
    border-top: 1px solid #f1f1f1;
    display: none;
  }

  .vcv-role-manager-capabilities-form--item--active .vcv-role-manager-capabilities-form--item--content {
    display: block;
  }

  .vcv-role-manager-capabilities-form .vcv-ui-settings-status-table {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-shadow: none;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    margin: 0 0 8px;
  }

  .vcv-role-manager-capabilities-form .vcv-ui-settings-status-table:last-of-type {
    padding-bottom: 0;
    border: none;
  }

  .vcv-ui-settings-status-table-row {
    display: flex;
    align-items: center;
    padding: 15px 0;
    flex: 0 0 48%;
  }

  .vcv-settings-section .vcv-ui-settings-status-table .description {
    margin: 0;
  }

  .vcv-settings-section .vcv-ui-settings-status-table .vcv-ui-settings-status-table-title {
    color: #5F5F70;
  }

  .vcv-ui-settings-status-table-title {
    flex: 0 0 50%;
    padding: 0 10px 0 0;
  }

  .vcv-ui-settings-status-table-content {
    flex: 0 0 50%;
  }

  .vcv-role-manager-capabilities-form .vcv-submit-button-container {
    align-self: flex-start;
  }

  @media screen and (max-width: 1024px) {
    .vcv-ui-settings-status-table-row {
      flex: 0 0 100%;
    }
  }

</style>
<form action="<?php echo vchelper('Url')->adminAjax(
    ['vcv-action' => 'settings:roles:save:adminNonce', 'vcv-nonce' => vchelper('Nonce')->admin()]
); ?>"
        method="post"
        data-vcv-ui-element="settings-tab-<?php echo esc_attr($slug); ?>"
        class="vcv-role-manager-capabilities-form">
    <?php
    $submitButtonAttributes = [
        'id' => 'submit_btn-' . $slug,
    ];
    $submitButtonAttributes = apply_filters(
        'vcv:template:settings:settings-tab-submit-button-attributes',
        $submitButtonAttributes,
        $slug
    );
    $submitButtonAttributes = apply_filters(
        'vcv:template:settings:settings-tab-submit-button-attributes' . $slug,
        $submitButtonAttributes,
        $slug
    );
    foreach ($editableRoles as $role => $details) {
        $roleObject = get_role($role);
        if (!$roleObject) {
            continue;
        }
        $name = translate_user_role($details['name']);
        $stateCapabilities = $roleAccessHelper->who($role)->getAllCaps($role);

        echo '<div class="vcv-role-manager-capabilities-form--item">
   <div class="vcv-role-manager-capabilities-form--item--heading">
    ' . $name . '
   </div>
   <div class="vcv-role-manager-capabilities-form--item--content">';
        if ($role === 'administrator') {
            $part = 'post_types';
            $stateValue = $roleAccessHelper->who($role)->part($part)->getState();
            echo vcfilter(
                'vcv:render:settings:roleManager:part:' . $part,
                '',
                [
                    'part' => $part,
                    'stateValue' => $stateValue,
                    'stateCapabilities' => $stateCapabilities,
                    'role' => $role,
                    'roleObject' => $roleObject,
                    'roleAccessHelper' => $roleAccessHelper,
                ]
            );
            echo 'The rest options are enabled for Administrator user role';
        } elseif ($role === 'subscriber') {
            echo 'Select user role preset for Author or customize access rights.';
        } else {
            foreach ($accessParts as $part) {
                $stateValue = $roleAccessHelper->who($role)->part($part)->getState();
                echo vcfilter(
                    'vcv:render:settings:roleManager:part:' . $part,
                    '',
                    [
                        'part' => $part,
                        'stateValue' => $stateValue,
                        'stateCapabilities' => $stateCapabilities,
                        'role' => $role,
                        'roleObject' => $roleObject,
                        'roleAccessHelper' => $roleAccessHelper,
                    ]
                );
            }

            if (!vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
                // TODO: Show Teaser
                echo 'More options available in premium';
            }
        }
        echo '
   </div>
</div>';
    }
    ?>
    <div class="vcv-submit-button-container">
        <?php submit_button(
            __('Save Changes', 'visualcomposer'),
            'vcv-dashboard-button vcv-dashboard-button--save',
            'submit_btn',
            false,
            $submitButtonAttributes
        ) ?>
    </div>
    <input type="hidden" name="vcv_action" value="vcv_action-<?php echo esc_attr(
        $slug
    ); ?>" id="vcv_settings-<?php echo esc_attr($slug); ?>-action" />
    <script>
      (function () {
        // global event listener (from youmightnotneedjquery)
        document.addEventListener('click', function (e) {
          // loop parent nodes from the target to the delegation node
          for (var target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches('.vcv-role-manager-capabilities-form--item--heading')) {
              target.parentElement.classList.toggle('vcv-role-manager-capabilities-form--item--active')
              break;
            }
          }
        }, false);
      })()
    </script>
</form>