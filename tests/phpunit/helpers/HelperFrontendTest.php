<?php

class HelperFrontendTest extends WP_UnitTestCase
{
    public function testRenderPost()
    {
        wp_set_current_user(1);
        // problem is that get_the_ID() should not be changed, and must stay global as before, current loop must not be affected
        $this->createGlobalQuery();
        $createInitialPostId = $this->createPost('initial post', 'post');
        vchelper('PostType')->setupPost($createInitialPostId);
        $this->assertEquals($createInitialPostId, get_the_ID());

        // clear scripts output
        ob_start();
        do_action('wp_enqueue_scripts'); // just to fix further tests
        do_action('wp_print_scripts'); // Load localize scripts
        wp_scripts()->do_items(false, 2); // Group === 2 to exclude vcv: scripts in content
        ob_end_clean();

        // create few posts
        $newPostId = $this->createPost('hello!!!', 'post');
        $newPostIdSecond = $this->createPost('second!!!!', 'post');
        $frontendHelper = vchelper('Frontend');
        ob_start();
        echo $frontendHelper->renderContent($newPostId);
        $content = ob_get_clean();
        $this->assertEquals($createInitialPostId, get_the_ID());
        $this->assertEquals('<p>hello!!!</p>' . PHP_EOL, $content);

        ob_start();
        echo $frontendHelper->renderContent($newPostIdSecond);
        $content = ob_get_clean();
        $this->assertEquals($createInitialPostId, get_the_ID());
        $this->assertEquals('<p>second!!!!</p>' . PHP_EOL, $content);
    }

    public function testWpQueryResets()
    {
        // problem is that when wp_reset_query triggered inside the loop (HFS) after HFS render it must continue general loop
        // step 1. create data for general loop
        $generalIds = $this->createGlobalQuery();
        global $wp_query;

        // step 2.
        $x = 0;
        while ($wp_query->have_posts()) {
            $wp_query->the_post();
            // this will trigger reset query...
            $this->step2ForTestWpQuery();
            $this->assertEquals($generalIds[ $x ], get_the_ID());
            $x++;
        }
        $this->assertEquals(5, $x);
    }

    protected function step2ForTestWpQuery()
    {
        // emulate the wp_reset_query!!!
        global $wp_query;
        $backup = clone $wp_query;
        $newIds = [];
        $newIds[] = $this->createPost('new step2ForTestWpQuery 1', 'post');
        $newIds[] = $this->createPost('new step2ForTestWpQuery 2', 'post');
        $wp_query = new \WP_Query(['post_type' => 'post', 'post__in' => $newIds, 'orderby' => 'ID', 'order' => 'ASC']);
        $frontendHelper = vchelper('Frontend');
        $x = 0;
        while ($wp_query->have_posts()) {
            $x++;
            the_post();
            ob_start();
            echo $frontendHelper->renderContent(get_the_ID());
            $content = ob_get_clean();
            $this->assertEquals('<p>new step2ForTestWpQuery ' . $x . '</p>' . PHP_EOL, $content);
        }
        $wp_query = $backup;
        wp_reset_query();
    }

    public function testWpQueryResetsRegularFunc()
    {
        // problem is that when wp_reset_query triggered inside the loop (HFS) after HFS render it must continue general loop
        // step 1. create data for general loop
        $generalIds = $this->createGlobalQuery();
        global $wp_query;

        // step 2.
        $x = 0;
        while ($wp_query->have_posts()) {
            $wp_query->the_post();
            // this will trigger reset query...
            $this->step2ForTestWpQueryRegularFunc();
            $this->assertEquals($generalIds[ $x ], get_the_ID());
            $x++;
        }
        $this->assertEquals(5, $x);
    }

    protected function step2ForTestWpQueryRegularFunc()
    {
        $newIds = [];
        $newIds[] = $this->createPost('new step2ForTestWpQueryRegularFunc 1', 'post');
        $newIds[] = $this->createPost('new step2ForTestWpQueryRegularFunc 2', 'post');
        query_posts(['post_type' => 'post', 'post__in' => $newIds, 'orderby' => 'ID', 'order' => 'ASC']);
        $frontendHelper = vchelper('Frontend');
        $x = 0;
        while (have_posts()) {
            $x++;
            the_post();
            ob_start();
            echo $frontendHelper->renderContent(get_the_ID());
            $content = ob_get_clean();
            $this->assertEquals('<p>new step2ForTestWpQueryRegularFunc ' . $x . '</p>' . PHP_EOL, $content);
        }
        wp_reset_query();
    }

    public function testQueryResetInsideLoop()
    {
        wp_set_current_user(1);
        $originalContent = '[test-query-reset] first';
        $originalId = $this->createPost($originalContent, 'post');
        $originalIdClone = $this->createPost($originalContent . 'clone', 'post');
        wp_reset_query();
        // override global query!
        global $wp_the_query, $wp_query, $post;
        $generalQuery = new \WP_Query(
            [
                'post_type' => 'post',
                'p' => $originalId,
            ]
        );
        $wp_the_query = $generalQuery;
        $wp_query = $generalQuery;
        $post = get_post($originalId);
        wp_reset_query();
        $second = $this->createPost('second testQueryResetInsideLoop', 'post');
        $third = $this->createPost('third testQueryResetInsideLoop', 'post');

        add_shortcode(
            'test-query-reset',
            function () {
                ob_start();
                $loop = new WP_Query('post_type=post&posts_per_page=1&orderby=post_date&order=ASC');
                while ($loop->have_posts()) {
                    $loop->the_post();

                    echo 'title:' . get_the_title() . ':';
                }
                wp_reset_query();

                return 'inside-shortcode' . ob_get_clean();
            }
        );

        // This previously broke wp_the_query reference
        $secondContent = vchelper('Frontend')->renderContent($second);
        ob_start();
        while (have_posts()) {
            the_post();
            the_content();
        }
        $content = ob_get_clean();
        $this->assertEquals(
            '<p>inside-shortcodetitle:random title%5Btest-query-reset%5D%20first: first</p>',
            trim($content)
        );

        wp_reset_query();
    }

    protected function createPost($content, $postType = 'page')
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => $postType,
                'post_content' => $content,
                'post_status' => 'publish',
                'post_title' => 'random title' . rawurlencode($content),
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        sleep(1); // this makes test stable in pipelines... maybe because of database instert timeout

        return $postId;
    }

    /**
     * @return array
     */
    protected function createGlobalQuery($content = '')
    {
        $generalIds = [];
        $generalIds[] = $this->createPost($content ? $content : 'createGlobalQuery first', 'post');
        $generalIds[] = $this->createPost($content ? $content : 'createGlobalQuery second', 'post');
        $generalIds[] = $this->createPost($content ? $content : 'createGlobalQuery third', 'post');
        $generalIds[] = $this->createPost($content ? $content : 'createGlobalQuery fourth', 'post');
        $generalIds[] = $this->createPost($content ? $content : 'createGlobalQuery fifth', 'post');

        // override global query!
        global $wp_the_query, $wp_query;
        $generalQuery = new \WP_Query(
            [
                'post_type' => 'post',
                'post__in' => $generalIds,
                'orderby' => 'ID',
                'order' => 'ASC',
            ]
        );
        $wp_the_query = $generalQuery;
        $wp_query = $generalQuery;
        $wp_query->rewind_posts();

        return $generalIds;
    }
}
