<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Version
 * @package VisualComposer\Modules\System\Activation
 */
class Version extends Container implements Module
{
    use EventsFilters;

    /**
     * Version constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Activation\Version::setVersion */
        $this->addEvent(
            'vcv:system:activation:hook',
            'setVersion'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     */
    protected function setVersion(Options $options)
    {
        $options->set('version', VCV_VERSION);
    }
}
