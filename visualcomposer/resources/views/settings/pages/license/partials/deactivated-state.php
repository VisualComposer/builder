<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>

<?php /*if ($devEnvironment) : ?>
    <br/>
    <div class="updated vc_updater-result-message">
        <p>
            <strong>
                <?php echo __(
                    'It is optional to activate license on localhost development environment. You can still activate license on localhost to receive plugin updates.',
                    'vc5'
                ) ?>
            </strong>
        </p>
    </div>
<?php endif*/ ?>

<div class="vc_settings-activation-deactivation">
    <p>
        <?php echo __(
            'In order to receive all benefits of Visual Composer you need to activate your copy of plugin. By activating Visual Composer license you will unlock premium options - <strong>direct plugin updates</strong> and <strong>access to official support.</strong>',
            'vc5'
        ) ?>
    </p>

    <br/>

    <p>
        <button
            class="button button-primary button-hero button-updater"
            data-vc-action="activation"
            type="button"
            id="vc_settings-updater-button">
            <?php echo __('Activate Visual Composer', 'vc5') ?>
        </button>

        <img src="<?php echo get_admin_url() ?>/images/wpspin_light.gif"
            class="vc_updater-spinner"
            id="vc_updater-spinner"
            width="16"
            height="16"
            alt="spinner"/>
    </p>

    <p class="description">
        <?php echo sprintf(
            __(
                'Don\'t have valid license yet? <a href="%s" target="_blank">Purchase Visual Composer license</a>.',
                'vc5'
            ),
            esc_url('http://bit.ly/vcomposer')
        ) ?>
    </p>

</div>
