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
    vcevent('vcv:resources:views:editor:templates:blankTemplate:wpHead:before');
    wp_head();
    vcevent('vcv:resources:views:editor:templates:blankTemplate:wpHead:after');
    ?>
</head>
<body <?php body_class(); ?>>
<?php
if (function_exists('wp_body_open')) {
    wp_body_open();
}

while (have_posts()) :
    the_post();
    ?>
    <div class="vcv-content--blank">
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    </div>
    <?php
endwhile;
vcevent('vcv:resources:views:editor:templates:blankTemplate:wpFooter:before');
wp_footer();
vcevent('vcv:resources:views:editor:templates:blankTemplate:wpFooter:after');
?>
</body>
</html>
