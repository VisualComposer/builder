<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$slides = vchelper('SettingsPagesAbout');
$editorPostTypeHelper = vchelper('AccessEditorPostType');
$currentUserHelper = vchelper('AccessCurrentUser');
?>
<!-- Last screen -->
<div class="vcv-popup-last-go-premium-screen">
    <div class="vcv-popup-content">
        <!-- Logo -->
        <div class="vcv-logo">
            <svg width="67px" height="69px" viewBox="0 0 36 37" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="01-Intro-Free" transform="translate(-683.000000, -185.000000)">
                        <g id="VC-Logo" transform="translate(683.000000, 185.000000)">
                            <polygon id="Fill-1" fill="#257CA0" points="17.982 21.662 17.989 37 8.999 31.837 8.999 21.499"></polygon>
                            <polyline id="Fill-5" fill="#74953D" points="17.71 5.977 26.694 6.139 26.708 21.494 17.71 21.315 17.71 5.977"></polyline>
                            <polyline id="Fill-4" fill="#2CA2CF" points="26.708 21.494 17.982 26.656 8.999 21.498 17.72 16.315 26.708 21.494"></polyline>
                            <polyline id="Fill-6" fill="#9AC753" points="35.42 5.972 26.694 11.135 17.71 5.977 26.432 0.793 35.42 5.972"></polyline>
                            <polygon id="Fill-8" fill="#A77E2D" points="8.984 6.145 8.998 21.499 0 16.32 0 5.98"></polygon>
                            <polyline id="Fill-9" fill="#F2AE3B" points="17.71 5.977 8.984 11.139 0 5.98 8.722 0.799 17.71 5.977"></polyline>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <div class="vcv-popup-heading vcv-popup-heading-last-screen">
            <?php echo __('Any Layout. Fast and Easy.', 'vcwb'); ?>
        </div>

        <!-- GIF Slider -->
        <div class="vcv-popup-slider-container">
            <div class="vcv-popup-slider">
                <?php foreach ($slides->getSlides() as $slide) : ?>
                    <?php echo vcview('account/partials/activation-slide', $slide); ?>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="vcv-button-container">
            <?php if ($currentUserHelper->wpAll('edit_pages')->get()
                && $editorPostTypeHelper->isEditorEnabled('page')) : ?>
		        <a href="post-new.php?post_type=page&vcv-action=frontend" class="vcv-popup-button vcv-popup-last-screen-button">
			        <span><?php echo __('Create a blank page', 'vcwb'); ?></span>
		        </a>
            <?php elseif ($currentUserHelper->wpAll('edit_posts')->get()
                && $editorPostTypeHelper->isEditorEnabled('post')) : ?>
		        <a href="post-new.php?vcv-action=frontend" class="vcv-popup-button vcv-popup-last-screen-button">
			        <span><?php echo __('Create a blank post', 'vcwb'); ?></span>
		        </a>
            <?php endif; ?>
        </div>
        <p class="vcv-popup-helper vcv-popup-last-screen-helper"><?php echo __(
                'Want to work with existing pages, posts or custom post types? Access your content and select `Edit with Visual Composer`.',
                'vcwb'
            ); ?></p>
        <p class="vcv-popup-helper vcv-popup-last-screen-helper"><?php echo __(
                'Don\'t forget to tweet about Visual Composer Website Builder. Thanks!',
                'vcwb'
            ); ?>
            <a href="https://twitter.com/share"
                data-via="wpbakery"
                data-hashtags="madeinvc"
                class="twitter-share-button"
                data-text="<?php esc_attr_e(
                    'Visual Composer Website Builder - now I can build any #WordPress site fast and easy!',
                    'vcwb'
                ); ?>"
                data-url="http://visualcomposer.io"
                data-size="large">Tweet</a>
            <script>!function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[ 0 ], p = /^http:/.test(d.location) ? 'http' : 'https';
                if (!d.getElementById(id)) {
                  js = d.createElement(s);
                  js.id = id;
                  js.src = p + '://platform.twitter.com/widgets.js';
                  fjs.parentNode.insertBefore(js, fjs);
                }
              }(document, 'script', 'twitter-wjs');</script>
        </p>
    </div>
</div>
