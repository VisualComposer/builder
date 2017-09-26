<?php

namespace VisualComposer\Modules\Hub\Teaser;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Modules\Hub\Download\Actions\Traits\Action;

class TeaserDownloadController extends Container implements Module
{
    use Action;
    protected $actionName = 'hubTeaser';
    protected $helperName = 'HubActionsHubTeaserBundle';

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_TEASER')) {
            $this->addFilter('vcv:hub:process:json:' . $this->actionName, 'processAction');
            $this->addFilter('vcv:hub:download:bundle:' . $this->actionName, 'updateTeaser');
        }
    }

    protected function updateData($response, $payload, Options $optionsHelper)
    {
        if (!vcIsBadResponse($response)) {
            $archive = $payload['archive'];
            $optionsHelper->set('hubTeaserElements', $archive);
        }

        return $response;
    }
}
