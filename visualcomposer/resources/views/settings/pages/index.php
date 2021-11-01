<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
?>
<?php if ($slug === 'vcv-headers-footers' || $slug === 'vcv-custom-page-templates') { ?>
    <style>
      .vcv-settings-tab-content,
      .vcv-headers-footers_headers-footers-all-site,
      .vcv-headers-footers_headers-footers-separate-post-types {
        visibility: hidden;
      }

      .vcv-table-loader-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
      }

      .vcv-table-loader {
        height: 16px;
        width: 16px;
        margin-top: 40px;
        transform: translate(-50%, -50%);
        animation: vcv-ui-wp-spinner-animation .7s linear infinite;
      }

      @keyframes vcv-ui-wp-spinner-animation {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      .vcv-ui-settings-sections {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .vcv-settings-form--item {
        background-color: #fff;
        border: none;
        border-radius: 5px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
      }

      .vcv-settings-form--item .vcv-no-title.vcv-hidden {
          visibility: hidden;
          height: 0;
      }

      .vcv-settings-form--item--teaser .vcv-settings-form--item--heading {
        cursor: auto;
      }

      .vcv-settings-form--item--teaser .vcv-settings-form--item--heading::after {
        display: none;
      }

      .vcv-settings-form-item--heading-text {
        flex-grow: 1;
        margin: 6px 0;
      }

      .vcv-settings-form--item--teaser .vcv-settings-form-item--heading-text {
        opacity: .5;
      }

      .vcv-settings-form--item--heading {
        padding: 10px 16px;
        font-family: 'Montserrat', sans-serif;
        line-height: 18px;
        font-weight: 600;
        font-size: 18px;
        color: #515162;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      .vcv-settings-form--item--heading::after {
        position: absolute;
        right: 16px;
        font-family: 'VC-Icons', serif;
        font-size: 18px;
        width: 18px;
        height: 18px;
        content: "\25be";
        color: #C6CBD4;
        margin-top: 6px;
      }

      .vcv-settings-form--item--active .vcv-settings-form--item--heading::after {
        content: "\25b4";
      }

      .vcv-settings-form-item--title {
          display: flex;
      }

      .vcv-settings-form-item--title h2 {
          flex: 0 0 250px;
      }

      .vcv-settings-form--item--content {
        padding: 16px;
        border-top: 1px solid #f1f1f1;
        display: none;
      }

      .vcv-settings-form--item .vcv-settings-form--item--content h2 {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 15px;
        color: #8E8E9E;
      }

      .vcv-settings-form--item--active .vcv-settings-form--item--content {
        display: block;
      }

      .vcv-settings-form .vcv-ui-settings-status-table {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        box-shadow: none;
        border-radius: 0;
        margin: 0 0 8px;
      }

      .vcv-settings-form--item .vcv-settings-section {
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid #F1F1F1;
      }

      .vcv-settings-form--item .vcv-settings-section:last-of-type {
        border: none;
      }

      .vcv-settings-section .vcv-ui-settings-status-table .description {
        margin: 0;
      }

      .vcv-settings-section .vcv-ui-settings-status-table .vcv-ui-settings-status-table-title {
        color: #5F5F70;
      }
    </style>
    <div class="vcv-table-loader-wrapper">
        <div class="vcv-table-loader">
            <svg version="1.1" id="vc_wp-spinner" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px" y="0px" width="16px" height="16px">
                <defs>
                    <mask id="hole">
                        <rect width="100%" height="100%" fill="white" />
                        <circle r="2px" cx="50%" cy="25%" />
                    </mask>
                </defs>
                <circle r="8px" cx="50%" cy="50%" mask="url(#hole)" fill="#808080" />
            </svg>
        </div>
    </div>
<?php } ?>
<form action="<?php echo vchelper('Url')->adminAjax(
    ['vcv-action' => 'settings:save:adminNonce', 'vcv-nonce' => vchelper('Nonce')->admin()]
); ?>"
        method="post"
        data-vcv-ui-element="settings-tab-<?php echo esc_attr($slug); ?>"
        class="vcv-settings-tab-content vcv-settings-tab-content-active">
    <?php

    $sectionsRegistry = vchelper('SettingsSectionsRegistry');
    $orderedSections = $sectionsRegistry->getHiearchy($sectionsRegistry->findBySlug($slug));

    $viewsHelper = vchelper('Views');
    if (!empty($orderedSections)) {
        $useAccordion = false;
        ob_start();
        foreach ($orderedSections as $section) {
            $useAccordion = $viewsHelper->doNestedSection($section, $slug) || $useAccordion;
        }
        $content = ob_get_clean();
        if ($useAccordion) {
            echo '<div class="vcv-ui-settings-sections">';
            echo $content;
            echo '</div>';
        } else {
            echo $content;
        }
    }

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
    ?>
    <div class="vcv-submit-button-container">
        <?php submit_button(__('Save Changes', 'visualcomposer'), 'vcv-dashboard-button vcv-dashboard-button--save', 'submit_btn', false, $submitButtonAttributes) ?>
    </div>

    <input type="hidden" name="vcv_action" value="vcv_action-<?php echo esc_attr(
        $slug
    ); ?>" id="vcv_settings-<?php echo esc_attr($slug); ?>-action" />

    <input type="hidden" name="vcv-page-slug" value="<?php echo $slug; ?>" />
</form>


<script>
  (function () {
    // global event listener (from youmightnotneedjquery)
    document.addEventListener('click', function (e) {
      // loop parent nodes from the target to the delegation node
      for (let target = e.target; target && target !== this; target = target.parentNode) {
        if (target.matches('.vcv-settings-form--item--heading')) {
          target.parentElement.classList.toggle('vcv-settings-form--item--active')
          break;
        }
      }
    }, false);
  })()
</script>
