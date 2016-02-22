<?php

namespace App\Drivers\WordPress\Modules\PageFront;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class PageFrontControllerDriver
 * @package App\Drivers\WordPress\Modules\PageFront
 */
class PageFrontControllerDriver
{
    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * PageFrontControllerDriver constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;

        add_action(
            'wp_head',
            function () {
                $this->event->fire('driver:head');
            }
        );

        add_action(
            'wp_enqueue_scripts',
            function () {
                wp_enqueue_script('jquery');
            }
        );

        add_filter(
            'edit_post_link',
            function ($link) {
                $result = last(
                    $this->event->fire(
                        'driver:edit_post_link',
                        [
                            $link,
                            get_the_ID(),
                        ]
                    )
                );

                return $result ?: $link;
            }
        );

        $this->event->listen(
            'vc:page_front:output_scripts:get_ajax_url',
            function () {
                return admin_url('admin-ajax.php', 'relative');
            }
        );
    }
}