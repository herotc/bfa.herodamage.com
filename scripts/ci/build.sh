#!/bin/bash

# TODO: rewrite in JS ?

set -e # Exit with nonzero exit code if anything fails

# Pull requests shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "[CI] Will skip deploy; just doing a build"
    npm run build
    exit 0
fi
