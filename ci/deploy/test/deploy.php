<?php

// All Deployer recipes are based on `recipe/common.php`.
require 'recipe/common.php';

server('test', 'test.hubpen.visualcomposer.io', 22)
    ->user(getenv('CI_DEPLOY_USER'))
    ->password(getenv('CI_DEPLOY_PASSWORD'))
    ->stage('staging')
    ->env('deploy_path', '/var/www/test.alpha.visualcomposer.io/dist/vc-five/');

set('repository', 'git@gitlab.com:visual-composer-website-builder/builder.git');
env('branch', 'master');

set('http_user', getenv('CI_DEPLOY_USER'));

set(
    'shared_dirs',
    [
        'node_modules',
        'vendor',
    ]
);

/**
 * Override default 'deploy:vendors' task that installs only composer packages
 */
task(
    'deploy:vendors',
    function () {
        $sharedPath = "{{deploy_path}}/shared";
        cd('{{release_path}}');
        run('cp package.json {{deploy_path}}/shared');
        cd($sharedPath);
        run('npm update --loglevel=error');
        cd('{{release_path}}');
        run('php ci/composer.phar update --prefer-dist --no-progress');
        run('npm run build');
    }
)->desc('Install npm, composer and bower packages');

task(
    'restart',
    function () {
        run('echo \'' . getenv('CI_DEPLOY_PASSWORD') . '\' | sudo -S service apache2 restart');
    }
);

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
        'restart',
    ]
)->desc('Deploy your project');
