<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var array $page
 */
$editableRoles = get_editable_roles();
uksort(
    $editableRoles,
    function ($roleA, $roleB) {
        $list = 'administrator,editor,author,contributor,subscriber,';
        $roleFirstPos = strpos($list, $roleA . ',');
        if ($roleFirstPos === false) {
            $roleFirstPos = 1000;
        }
        $roleSecondPos = strpos($list, $roleB . ',');
        if ($roleSecondPos === false) {
            $roleSecondPos = 1000;
        }

        return $roleFirstPos - $roleSecondPos;
    }
);
$roleAccessHelper = vchelper('AccessRole');
$accessParts = $roleAccessHelper->getAvailableParts();
?>
<style>
  .vcv-role-manager-capabilities-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
  }

  .vcv-role-manager-capabilities-form .vcv-premium-teaser-inner {
    padding: 5px 0 30px;
  }

  .vcv-role-manager-capabilities-form .vcv-premium-teaser-image {
    width: 82px;
    height: 82px;
    background-image: url("data:image/svg+xml,%3Csvg width='82px' height='82px' viewBox='0 0 82 82' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='vcwb-role-manager-premium-teaser' transform='translate(-710.000000, -548.000000)' fill-rule='nonzero'%3E%3Cg id='vcwb-role-manager' transform='translate(310.000000, 0.000000)'%3E%3Cg id='table-03' transform='translate(27.000000, 453.000000)'%3E%3Cg id='Teaser' transform='translate(179.000000, 95.000000)'%3E%3Cg id='001-lock' transform='translate(194.000000, 0.000000)'%3E%3Cpath d='M73.2751092,52.771262 L73.2751092,48.5525641 C72.7411135,35.8108514 54.4157729,35.8207736 53.8864629,48.5525641 L53.8864629,52.7170099 C48.7319913,54.4012243 45,59.2138142 45,64.8761931 L45,69.1971537 C45,76.2566432 50.7984978,82 57.9257642,82 L69.0742358,82 C76.2015022,82 82,76.2566432 82,69.1971537 L82,64.8761931 C82,59.2731874 78.3457249,54.5026869 73.2751092,52.771262 Z M63.580786,45.3518525 C65.3626026,45.3518525 66.8122271,46.7876917 66.8122271,48.5525641 L66.8122271,52.0733468 L60.349345,52.0733468 L60.349345,48.5525641 C60.349345,46.7876917 61.7989694,45.3518525 63.580786,45.3518525 Z M75.5371179,69.1971537 C75.5371179,72.7268984 72.637869,75.5985769 69.0742358,75.5985769 L57.9257642,75.5985769 C54.362131,75.5985769 51.4628821,72.7268984 51.4628821,69.1971537 L51.4628821,64.8761931 C51.4628821,61.3464484 54.362131,58.4747699 57.9257642,58.4747699 L69.0742358,58.4747699 C72.637869,58.4747699 75.5371179,61.3464484 75.5371179,64.8761931 L75.5371179,69.1971537 Z M67.6200873,67.1166912 C67.6200873,69.3263024 65.8116114,71.1175807 63.580786,71.1175807 C58.2227336,70.9068138 58.2241878,63.3257684 63.580786,63.1158017 C65.8116114,63.1158017 67.6200873,64.90708 67.6200873,67.1166912 Z' id='Shape' fill='%23F7B332'%3E%3C/path%3E%3Cpath d='M62.78125,0 C73.3784687,0 82,8.62153125 82,19.21875 L82,36.1953125 C81.830875,40.4452188 75.7614336,40.4420156 75.59375,36.1953125 L75.59375,19.21875 C75.59375,12.1539375 69.8460625,6.40625 62.78125,6.40625 L19.21875,6.40625 C12.1539375,6.40625 6.40625,12.1539375 6.40625,19.21875 L6.40625,62.78125 C6.40625,69.8460625 12.1539375,75.59375 19.21875,75.59375 L38.5976562,75.59375 C42.8475625,75.762875 42.8443594,81.8323164 38.5976562,82 L19.21875,82 C8.62153125,82 0,73.3784687 0,62.78125 L0,19.21875 C0,8.62153125 8.62153125,0 19.21875,0 L62.78125,0 Z M49.1679687,14.4140625 C50.9370547,14.4140625 52.3710937,15.8481016 52.3710937,17.6171875 C52.3710937,19.3862734 50.9370547,20.8203125 49.1679687,20.8203125 L49.1679687,20.8203125 L32.8320312,20.8203125 C28.5853281,20.6526289 28.582125,14.5831875 32.8320312,14.4140625 L32.8320312,14.4140625 Z' id='Combined-Shape' fill='%23515162'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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
    line-height: 18px;
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

  .vcv-role-manager-capabilities-form--item--content .vcv-ui-form-switch input,
  .vcv-role-manager-capabilities-form--item--content .vcv-ui-form-switch .vcv-ui-form-switch-indicator,
  .vcv-role-manager-capabilities-form--item--content .vcv-ui-form-switch .vcv-ui-form-switch-label {
    font-family: 'Roboto', sans-serif;
  }

  .vcv-role-manager-capabilities-form--item--content p.admin-description {
    margin-top: -20px;
  }

  .vcv-role-manager-capabilities-form--item .vcv-role-manager-capabilities-form--item--content h2 {
    font-size: 16px;
  }

  .vcv-role-manager-capabilities-form--item--active .vcv-role-manager-capabilities-form--item--content {
    display: block;
  }

  .vcv-role-manager-capabilities-form .vcv-ui-settings-status-table {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-shadow: none;
    border-radius: 0;
    margin: 0 0 8px;
  }

  .vcv-ui-settings-status-table-row {
    display: flex;
    align-items: center;
    padding: 15px 0;
    flex: 0 0 48%;
  }

  .vcv-role-manager-capabilities-form--item .vcv-settings-section {
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #F1F1F1;
  }

  .vcv-role-manager-capabilities-form--item .vcv-settings-section:last-of-type {
    border: none;
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

  .vcv-ui-settings-status-table .vcv-ui-settings-status-table-title.vcv-help {
    overflow: visible;
  }

  .vcv-dashboard-main .vcv-settings-tab-content .vcv-ui-settings-status-table select.vcv-ui-form-dropdown.vcv-ui-form-presets-dropdown {
    min-width: 300px;
    margin-bottom: 8px;
    margin-top: 5px;
  }

  .vcv-ui-settings-status-table-title.vcv-help .vcv-help-tooltip-container {
    position: relative;
  }

  .vcv-ui-settings-status-table-title.vcv-help .vcv-help-tooltip-container:hover .vcv-help-tooltip {
    opacity: 1;
    z-index: 9999;
    top: calc(100% + 10px);
    left: -69px;
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
        class="vcv-role-manager-capabilities-form vcv-settings-tab-content">
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
    $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
    $defaultCapabilities = $userCapabilitiesHelper->getDefaultCapabilities();
    $prefixedDefaultCapabilities = $userCapabilitiesHelper->getPrefixedCapabilities();
    $dropdownOptions = [];
    foreach ($defaultCapabilities as $key => $value) {
        $presetPostfix = '';
        if ($key === 'administrator') {
            $presetPostfix = __(' (full access)', 'visualcomposer');
        } elseif ($key === 'subscriber') {
            $presetPostfix = __(' (no access)', 'visualcomposer');
        }
        $dropdownOptions[$key] = [
            'id' => $key,
            'title' => ucwords(str_replace('_', ' ', $key)) . $presetPostfix,
        ];
    }
    foreach ($editableRoles as $role => $details) {
        $roleObject = get_role($role);
        if (!$roleObject) {
            continue;
        }
        $name = translate_user_role($details['name']);

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
                    'stateCapabilities' => $roleObject->capabilities,
                    'role' => $role,
                    'roleObject' => $roleObject,
                    'roleAccessHelper' => $roleAccessHelper,
                ]
            );
            echo sprintf(
                '<p class="description admin-description">%s</p>',
                __('All other features are enabled for the Administrator user role.', 'visualcomposer')
            );
        } elseif ($role === 'subscriber') {
            echo sprintf(
                '<p class="description">%s</p>',
                __('All features are disabled for the Subscriber user role.', 'visualcomposer')
            );
        } elseif (!$roleObject->has_cap('edit_posts')) {
            echo sprintf(
                '<p class="description">%s</p>',
                __('All options are disabled for this user role. No `edit_posts` capability enabled.', 'visualcomposer')
            );
        } else {
            $presetPart = 'role_presets';
            $optionsHelper = vchelper('Options');
            $rolePresets = $optionsHelper->get('role-presets', []);

            $rolePresetValue = isset($rolePresets[$role]) ? $rolePresets[$role] : '';
            $rolePresetValue = vcfilter(
                'vcv:render:settings:roleManager:rolePreset',
                $rolePresetValue,
                ['role' => $role]
            );
            if (empty($rolePresetValue)) {
                $roleCapabilities = array_filter(
                    array_keys(get_role($role)->capabilities),
                    function ($item) {
                        return strpos($item, 'vcv_access_rules__') !== false;
                    }
                );
                if (
                    count(array_diff(
                        isset($prefixedDefaultCapabilities[$role]) ? $prefixedDefaultCapabilities[$role] : [],
                        $roleCapabilities
                    )) > 0
                ) {
                    $rolePresetValue = 'custom';
                }
            }
            echo vcfilter(
                'vcv:render:settings:roleManager:part:' . $presetPart,
                '',
                [
                    'part' => $presetPart,
                    'role' => $role,
                    'dropdownOptions' => $dropdownOptions,
                    'presetValue' => $rolePresetValue
                ]
            );
            foreach ($accessParts as $part) {
                $stateValue = $roleAccessHelper->who($role)->part($part)->getState();
                echo vcfilter(
                    'vcv:render:settings:roleManager:part:' . $part,
                    '',
                    [
                        'part' => $part,
                        'stateValue' => $stateValue,
                        'stateCapabilities' => $roleObject->capabilities,
                        'role' => $role,
                        'roleObject' => $roleObject,
                        'roleAccessHelper' => $roleAccessHelper,
                    ]
                );
            }

            if (!vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
                echo vcview(
                    'partials/teaser',
                    [
                        'page' => $page,
                    ]
                );
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

              const parent = e.target.parentElement;
              const presetDropdown = parent.querySelector('.vcv-ui-form-presets-dropdown')

              if (presetDropdown && presetDropdown.value !== 'custom') {
                  var event = new Event('change');
                  presetDropdown.dispatchEvent(event);
              }

              break;
            }
          }
        }, false);

        const presetDropdowns = document.querySelectorAll('[id^="vcv-settings-role-preset"]');
        const capabilityToggles = document.querySelectorAll('input[type=checkbox][name^="vcv-role-manager"]');
        capabilityToggles.forEach(toggle => {
            toggle.addEventListener('change', function () {
                const roleContent = toggle.closest('.vcv-role-manager-capabilities-form--item--content')
                const presetDropdown = roleContent.querySelector('select[id^="vcv-settings-role-preset"]')
                presetDropdown.value = 'custom';
            })
        })
        presetDropdowns.forEach(preset => {
            preset.addEventListener('change', function() {
                const role = preset.value
                const defaultCapabilities = window.VCV_DEFAULT_CAPABILITIES ? window.VCV_DEFAULT_CAPABILITIES() : null
                const roleContent = preset.closest('.vcv-role-manager-capabilities-form--item--content')
                const capSwitches = roleContent.querySelectorAll('.vcv-ui-form-switch > input[type=checkbox]')
                capSwitches.forEach(capSwitch => {
                    if (role === 'administrator') {
                        capSwitch.checked = true
                        return
                    }
                    const args = capSwitch.name.match(/[^[\]]+(?=\])/g)
                    const capabilityPart = args[1]
                    const capabilityKey = capSwitch.value

                    if (defaultCapabilities && defaultCapabilities[role] && defaultCapabilities[role][capabilityPart] && defaultCapabilities[role][capabilityPart].includes(capabilityKey)) {
                        capSwitch.checked = true
                    } else {
                        capSwitch.checked = false
                    }
                })
            })
        })
      })()
    </script>
</form>
