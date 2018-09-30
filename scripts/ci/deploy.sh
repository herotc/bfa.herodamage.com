#!/bin/bash

# TODO: rewrite in JS ?

set -e # Exit with nonzero exit code if anything fails

# Pull requests shouldn't try to deploy
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "[CI] Skipping deploy"
    exit 0
fi

# Git informations
echo "[CI] Get the SHA of the commit we are deploying"
GH_SHA=`git rev-parse --verify HEAD`

# Branches checkout
echo "[CI] Cloning the repository in public directory (without master checkout)"
git clone --quiet --no-checkout ${GH_REPO} public
echo "[CI] Checking out the target branch"
cd public
git checkout --quiet ${GH_TARGET_BRANCH} || git checkout --quiet --orphan ${GH_TARGET_BRANCH}
cd ..

# Run DBC scripts
echo "[CI] Run DBC scripts"
npm run dbc

# Build
echo "[CI] Gatsby build"
npm run build

# Should we deploy ?
cd public
echo "[CI] Check if it's worth to deploy"
# Continue the deployment if there are more file changes than what is set as deploy threshold
git diff --name-only > filenames.diff
filechanges=`cat filenames.diff | wc -l`
echo "[CI] $filechanges changed files detected"
if [ $filechanges -lt $DEPLOY_THRESHOLD ]; then
    echo "[CI] No meaningful changes detected; deploy aborted"
    exit 0
fi

# Convert the filenames into urls in a JSON array to purge CF cache later on
cd ..
echo "[CI] Convert the name of the changed files into urls in a JSON array"
node scripts/ci/jsondiff.js
cd public
rm filenames.diff

# Build push
echo "[CI] Commit and push the build"
git config user.name ${GH_USERNAME}
git config user.email ${GH_EMAIL}
git add --all .
git commit --quiet -m "Deployment ${GH_SHA}"
git push --quiet ${GH_REPO} ${GH_TARGET_BRANCH}
cd ..

# # Sleep before purging the CF cache, it takes roughly 15-30s to GitHub Pages to actually push the new content and up to 10 minutes to clear their CDN
# echo "[CI] Wait for 630s before clearing CF cache"
# sleep 630s
# echo "[CI] Clear CF cache entirely"
# curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" -H "X-Auth-Email: ${CF_AUTH_EMAIL}" -H "X-Auth-Key: ${CF_AUTH_KEY}" -H "Content-Type: application/json" --data '{"purge_everything":true}'
# echo "[CI] Clear CF cache for changed files by batch of ~450 urls each 5 seconds"
# for urls in urls_to_purge_*.json; do
#     sleep 5s
#     curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" -H "X-Auth-Email: ${CF_AUTH_EMAIL}" -H "X-Auth-Key: ${CF_AUTH_KEY}" -H "Content-Type: application/json" --data @$urls
#     echo ""
# done
