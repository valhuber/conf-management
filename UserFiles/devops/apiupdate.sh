#!/bin/sh
cd HCLDevopsDemo
git fetch --all
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
else
    echo "Needs a pull"
    git stash
    git reset --hard origin/master
    git stash pop
    cd ..
    sh apiimport_Zip.sh
fi