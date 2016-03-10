<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<div class="vc_welcome-tab changelog">

    <div class="vc_feature-section-teaser">
        <div>
            <img src="<?php echo vcapp('urlHelper')->assetUrl('images/about/screenshot.png') ?>"
                class="vc-featured-img"/>
            <h3><?php echo __('New Elements and Options', 'vc5') ?></h3>
            <p><?php echo __(
                    'Visual Composer 4.10 offers new and enhanced elements to improve your page building process. '
                    . 'You will discover new options that will help you build even better layouts and use unlimited'
                    . 'options of page building plugin.',
                    'vc5'
                ) ?></p>
            <p><?php echo __(
                    'We have been constantly following your feature requests and latest update contains '
                    . 'all the best of what you have been looking for. We are aiming to offer you most flexible tools '
                    . 'and options with everything you will ever need to creating a website.',
                    'vc5'
                ) ?></p>
        </div>
    </div>

    <div class="vc_welcome-feature feature-section vc_row">

        <div class="vc_col-xs-4">
            <img src="<?php echo vcapp('urlHelper')->assetUrl('images/about/01.png') ?>" class="vc-img-center"/>
            <h4><?php echo __('ACF Support', 'vc5') ?></h4>
            <p><?php echo __(
                    'Combine power of Visual Composer and ACF - add any custom field of '
                    . 'ACF to your page, post and even custom post type.',
                    'vc5'
                ) ?></p>
        </div>

        <div class="vc_col-xs-4">
            <img class="vc-img-center" src="<?php echo vcapp('urlHelper')->assetUrl('images/about/02.png') ?>"/>
            <h4><?php echo __('Categories and Authors', 'vc5') ?></h4>
            <p><?php echo __(
                    'Visual Composer Grid Builder has 2 more content elements allowing you to add data'
                    . ' about categories and authors to your post grid.',
                    'vc5'
                ) ?></p>
        </div>

        <div class="vc_col-xs-4">
            <img src="<?php echo vcapp('urlHelper')->assetUrl('images/about/03.png') ?>" class="vc-img-center"/>
            <h4><?php
                echo __('Parallax Speed', 'vc5');
                ?></h4>
            <p><?php
                echo __(
                    'Control speed of Visual Composer parallax to align this effect with your overall'
                    . ' website mood by simply adjusting speed parameter.',
                    'vc5'
                );
                ?></p>
        </div>

    </div>

    <p class="vc-thank-you">
        Thank you for choosing Visual Composer,
        <br/>
        Michael M, CEO at WPBakery
    </p>

</div>