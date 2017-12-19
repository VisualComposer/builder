<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Token;

/**
 * Class Free19Migration
 *
 * This migration fixes the free subscribe issue introduced in 1.9
 * when activation finish process didn't send correct email and category to account
 *
 * @package VisualComposer\Modules\Migrations
 */
class Free19Migration extends MigrationsController implements Module
{
    protected $migrationId = 'free19Migration';

    protected $migrationPriority = 1;

    protected function run(Token $tokenHelper, License $licenseHelper, Options $optionsHelper)
    {
        if ($tokenHelper->isSiteAuthorized() && !$licenseHelper->isActivated()
            && (!$optionsHelper->get('activation-email', false)
                || !$optionsHelper->get('activation-agreement', false)
                || !$optionsHelper->get('activation-category', false))
        ) {
            $tokenHelper->reset();
        }
    }
}
