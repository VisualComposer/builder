#!/bin/bash

output=$(git log --name-only HEAD~1..HEAD public/sources/assetsLibrary)

if [ -z "$output" ]
then
  exit 0
else
  echo "curl -X GET -H 'Content-type: application/json' \"$CI_HUB_GROUP_TEST_DOMAIN/api/inner/bundle/create?key=$CI_HUB_GROUP_ELEMENTS_BUILD_KEY&bundle=assets&version=latest&name=Assets\""
  curl -X GET -H 'Content-type: application/json' "$CI_HUB_GROUP_TEST_DOMAIN/api/inner/bundle/create?key=$CI_HUB_GROUP_ELEMENTS_BUILD_KEY&bundle=assets&version=latest&name=Assets"
fi
