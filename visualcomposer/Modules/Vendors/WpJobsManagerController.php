<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpJobsManagerController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (!defined('JOB_MANAGER_VERSION')) {
            return;
        }

        $this->wpAddAction(
            'job_content_start',
            function () {
                global $post;
                // @codingStandardsIgnoreLine
                $post->post_content = vcfilter('vcv:frontView:content:encode', $post->post_content);
            }
        );

        $this->wpAddAction(
            'vcv:addons:themeBuilder:pages:beforeMergeLayoutAndPostContent',
            'removeMetadataFromLayout'
        );
    }

    /**
     * Remove all metadata from content for layout cases.
     *
     * @return string
     */
    protected function removeMetadataFromLayout()
    {
        $this->wpRemoveClassMethodFilter(
            'the_content',
            'WP_Job_Manager_Post_Types',
            'job_content'
        );
    }
}
