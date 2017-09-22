<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class NoticeController.
 */
class NoticeController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        /** \VisualComposer\Modules\Settings\NoticeController::dismissNotice */
        $this->wpAddAction('admin_init', 'dismissNotice');
        /** \VisualComposer\Modules\Settings\NoticeController::createNotice */
        $this->wpAddAction('admin_notices', 'createNotice');
        /** \VisualComposer\Modules\Settings\NoticeController::unsetOptions */
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     */
    protected function createNotice(
        Options $optionsHelper,
        CurrentUser $currentUserHelper
    ) {
        $notices = $optionsHelper->getTransient('admin:notices');
        if (!empty($notices)) {
            foreach ($notices as $notice) {
                if (!$currentUserHelper->wpAll('manage_options')->get()
                    || get_user_meta(
                        get_current_user_id(),
                        'vcv:' . $notice['name'] . ':notice:' . $notice['time']
                    )
                ) {
                    return;
                }

                $class = 'notice notice-'.$notice['type'];

                if ($notice['dismissible']) {
                    printf(
                        '<div class="%1$s"><p>%2$s</p><p><a href="%3$s?vcv:%4$s:dismiss=1">%5$s</a></p></div>',
                        esc_attr($class),
                        $notice['message'],
                        esc_url(admin_url('index.php')),
                        $notice['name'],
                        __('Dismiss', 'vcwb')
                    );
                } else {
                    printf(
                        '<div class="%1$s"><p>%2$s</p><p></p></div>',
                        esc_attr($class),
                        $notice['message']
                    );
                }
            }
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function dismissNotice(
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $notices = $optionsHelper->getTransient('admin:notices');
        if (!empty($notices)) {
            foreach ($notices as $notice) {
                if ($notice['name'] && $notice['dismissible'] && $requestHelper->input('vcv:' . $notice['name'] . ':dismiss')) {
                    update_user_meta(
                        get_current_user_id(),
                        'vcv:' . $notice['name'] . ':notice:' . $notice['time'],
                        true
                    );
                }
            }
        }
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('admin:notices');
    }
}
