## Test running on local environment

### With docker
- If you are using docker you only need to pull predefined image `wpbakery/ci-wordpress`
- command: `docker pull wpbakery/ci-wordpress` default used php 5.6 enviroment.
- tags: `latest`=`php5.6`,`php5.5`, 'php7' 
- Running: `docker run wpbakery/ci-wordpress bash`

### Running tests on docker
- Firstly you need to copy plugin into docker
- Then just run `cd your_project_dir && phpunit --config=ci/phpunitconfig.xml`

### Without docker
- Look how dockerfile configured: https://github.com/wpbakery/ci-wordpress/blob/master/php56/Dockerfile
- You will need simillar setup: php, composer, phpunit
- Environment variables: WP_TESTS_DIR (directory for wordpress tests core), WP_TESTS_ABSPATH(directory for wordpress installation path), WP_TESTS_DOMAIN(domain name)
- Xdebug extension is required to get coverage details
- WP_TESTS_DIR content is available in https://github.com/wpbakery/ci-wordpress/php56 [tar.gz]
