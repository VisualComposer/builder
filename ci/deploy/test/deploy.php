<?php

// All Deployer recipes are based on `recipe/common.php`.
require 'recipe/symfony.php';


server('test', 'test.hubpen.visualcomposer.io', 22)
    ->user(getenv('CI_DEPLOY_USER'))
    ->password(getenv('CI_DEPLOY_PASSWORD'))
    ->stage('staging')
    ->env('deploy_path', '/var/www/test.alpha.visualcomposer.io/dist/vc-five/');

set('repository', 'git@ci.visualcomposer.io:vcb/vcb.git');
env('branch', 'master');

set('http_user', 'webuser');

/**
 * Override default 'deploy:vendors' task that installs only composer packages
 */
task(
    'deploy:vendors',
    function () {
        cd('{{release_path}}');
        run('npm install --loglevel=error');
        run('composer install --no-dev --prefer-dist --no-progress');
        run('webpack');
    }
)->desc('Install npm, composer and bower packages');

task(
    'deploy',
    [
        'deploy:prepare',
        'deploy:release',
        'deploy:update_code',
        'deploy:shared',
        'deploy:vendors',
        'deploy:writable',
        'deploy:symlink',
        'cleanup',
    ]
)->desc('Deploy your project');
