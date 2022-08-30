<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php
    wp_head();
    $customLayoutWidth = vchelper('Options')->get('custom-page-templates-section-layout-width', '1140');
    $customLayoutWidth = (int)rtrim($customLayoutWidth, 'px');
    if (empty($customLayoutWidth)) {
        $customLayoutWidth = '1140';
    }

    ?>
    <!-- Override the main container width styles -->
    <style>
        @media (min-width: 1200px) {
            div.vcv-content--boxed .entry-content > [data-vce-boxed-width="true"],
            div.vcv-content--boxed .vcv-layouts-html > [data-vce-boxed-width="true"],
            div.vcv-content--boxed .entry-content .vcv-layouts-html > [data-vce-boxed-width="true"],
            div.vcv-editor-theme-hf .vcv-layouts-html > [data-vce-boxed-width="true"],
            div.vcv-header > [data-vce-boxed-width="true"],
            div.vcv-footer > [data-vce-boxed-width="true"],
            div.vcv-content--boxed .entry-content > * > [data-vce-full-width="true"]:not([data-vce-stretch-content="true"]) > [data-vce-element-content="true"],
            div.vcv-content--boxed .vcv-layouts-html > * > [data-vce-full-width="true"]:not([data-vce-stretch-content="true"]) > [data-vce-element-content="true"],
            div.vcv-editor-theme-hf .vcv-layouts-html > * > [data-vce-full-width="true"]:not([data-vce-stretch-content="true"]) > [data-vce-element-content="true"],
            div.vcv-header > * > [data-vce-full-width="true"]:not([data-vce-stretch-content="true"]) > [data-vce-element-content="true"],
            div.vcv-footer > * > [data-vce-full-width="true"]:not([data-vce-stretch-content="true"]) > [data-vce-element-content="true"] {
                max-width: <?php echo esc_attr($customLayoutWidth) . 'px' ?> !important;
            }
        }
    </style>
</head>
<body <?php body_class(); ?>>
<?php
while (have_posts()) :
    the_post();
    ?>
    <div class="vcv-content--blank vcv-content--boxed">
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    </div>
    <?php
endwhile;
wp_footer(); ?>
</body>
</html>
