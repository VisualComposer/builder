<?php

if (!defined('ABSPATH')) {
    die('-1');
}

/** @var \VisualComposer\Helpers\Options $options */
$optionsHelper = vchelper('Options');
$elementsDownloaded = $optionsHelper->get('elements-downloaded');

?>
    <div class="vc_settings-activation-deactivation">
        <p>
            <?php echo __(
                'You have activated Visual Composer version which allows you to access all the customer benefits. Thank you for choosing Visual Composer as your page builder. If you do not wish to use Visual Composer on this WordPress site you can deactivate your license below.',
                'vc5'
            ) ?>
        </p>

        <br/>

        <p>
            <button
                class="button button-primary button-hero button-updater"
                data-vc-action="deactivation"
                type="button"
                id="vc_settings-updater-button">
                <?php echo __('Deactivate Visual Composer', 'vc5') ?>
            </button>

            <img src="<?php echo get_admin_url() ?>/images/wpspin_light.gif"
                class="vc_updater-spinner"
                id="vc_updater-spinner"
                width="16"
                height="16"
                alt="spinner"/>
        </p>
    </div>

<?php if (!$elementsDownloaded) : ?>
    <div class="updated notice" id="downloading-progress">
        <p>Please do not close this page. Downloading elements...</p>
    </div>
<?php endif ?>

<?php

if (!$elementsDownloaded) {
    /** @var \VisualComposer\Helpers\Url $urlHelper */
    $urlHelper = vchelper('Url');
    wp_enqueue_script('vcv:elements-js', $urlHelper->assetUrl('scripts/elements.js'));
}
