# Contributing to Visual Composer Website Builder

## Branch Organization
We will do our best to keep the **master** branch in good shape, with tests passing at all times.

If you send a pull request, please do it against the master branch. We maintain stable branches for major versions separately but we don’t accept pull requests to them directly. Instead, we cherry-pick non-breaking changes from master to the latest stable major version.

## Semantic Versioning
Visual Composer follows semantic versioning. We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.

Every significant change is documented in the changelog file.


## From Mainline to Fork-based repository workflow

Make fork for of VCWB repo in Gitlab.

To setup repo with SSH from the scratch

Go to your active Wordpress wp-plugin directory

```sh
$ git clone git@gitlab.com:<Username>/builder.git
$ cd builder
$ git remote add upstream git@gitlab.com:visual-composer-website-builder/builder.git
$ git remote -v
origin	git@gitlab.com:<Username>/builder.git (fetch)
origin	git@gitlab.com:<Username>/builder.git (push)
upstream	git@gitlab.com:visual-composer-website-builder/builder.git (fetch)
upstream	git@gitlab.com:visual-composer-website-builder/builder.git (push)
```

If you already have repo just follow the instructions

```sh
$ git remote rename origin upstream
$ git remote add origin git@gitlab.com:<Username>/builder.git
$ git remote -v
$ git push --set-upstream origin master
origin	git@gitlab.com:<Username>/builder.git (fetch)
origin	git@gitlab.com:<Username>/builder.git (push)
upstream	git@gitlab.com:visual-composer-website-builder/builder.git (fetch)
upstream	git@gitlab.com:visual-composer-website-builder/builder.git (push)
```

### Bring builder up to date

```sh
$ git checkout master && git pull upstream master # checkout
$ git merge upstream/master
$ git push
```

If you want to send you data to upstream you need to create merge request in Gitlab
