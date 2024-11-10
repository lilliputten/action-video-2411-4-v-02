#!/bin/sh
# @desc Update publish folder (prepare remote update)
# @since 2024.09.11, 21:40
# @changed 2024.11.10, 20:58

scriptsPath=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
rootPath=`dirname "$scriptsPath"`
prjPath=`pwd`

# Import config variables (expected variables `$DIST_REPO` and `$PUBLISH_FOLDER`)...
test -f "$rootPath/config.sh" && . "$rootPath/config.sh"
test -f "$rootPath/config-local.sh" && . "$rootPath/config-local.sh"
test -f "$prjPath/config.sh" && . "$prjPath/config.sh"
test -f "$prjPath/config-local.sh" && . "$prjPath/config-local.sh"

# Check basic required variables...
test -f "$scriptsPath/config-check.sh" && . "$scriptsPath/config-check.sh" # --omit-publish-folder-check

TIMESTAMP=`cat $rootPath/build-timestamp.txt`
TIMETAG=`cat $rootPath/build-timetag.txt`
VERSION=`cat $rootPath/build-version.txt`

PRJNAME=`git remote -v  | sed -rn '1s#.*/(.*)\.git.*#\1#p'`

ARCNAME="$PRJNAME-v.$VERSION-$TIMETAG.zip"

echo "Pack publish folder '$PUBLISH_FOLDER' to archive '$ARCNAME'..."

cd "$PUBLISH_FOLDER" && \
  pwd && \
  zip -r "../$ARCNAME" * -x "*_" -x "*.swp"
  cd .. && \
  echo OK
