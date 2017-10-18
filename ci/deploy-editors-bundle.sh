#!/bin/bash

output=$(git log --name-only HEAD~1..HEAD public/editor public/sources/attributes public/sources/css public/sources/fonts public/sources/images public/sources/less)

if [ -z "$output" ]
then
  exit 0
else
  echo "curl -X GET -H 'Content-type: application/json' \"$CI_HUB_GROUP_TEST_DOMAIN/api/inner/bundle/create?key=$CI_HUB_GROUP_ELEMENTS_BUILD_KEY&bundle=editors/editors&version=latest&name=Editors\""
  curl -X GET -H 'Content-type: application/json' "$CI_HUB_GROUP_TEST_DOMAIN/api/inner/bundle/create?key=$CI_HUB_GROUP_ELEMENTS_BUILD_KEY&bundle=editors/editors&version=latest&name=Editors"
fi
