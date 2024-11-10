#!/bin/sh
# @desc Config variables (common version -- stored in repository)
# @changed 2024.10.31, 17:59

# NOTE: May be overrided by `config-local.sh`
# NOTE: Don't forget to update rules in `public-publish/.htaccess` and `public-publish/robots.txt` files if you changed branch from production to demo.

# NOTE: It's possible to incorporate current branch (`DIST_BRANCH`) into the build tag?
DIST_BRANCH="publish" # Production build -> html-app-build

# TODO: Use the repo from `.git/config`?
DIST_REPO="git@github.com:lilliputten/action-video-2411-4-v-02.git"
SRC_TAG_PREFIX="v" # "v" for default tags like "v.X.Y.Z"

PUBLISH_FOLDER="src"
PUBLISH_TAG_ID="$DIST_BRANCH"

# Timezone for timestamps (GMT, Europe/Moscow, Asia/Bangkok, Asia/Tashkent, etc)
# NOTE: See duplications in 'config.js'
TIMEZONE="Europe/Moscow"
