#!/bin/sh
cd CALiveAPICreator/jetty.repository/teamspaces/default/apis/conf-management/
git fetch 
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
else	
    echo "Needs a pull"
    git pull
    cd ../../../../../../
    sh Stop.sh 
    echo "Server Stopped, Restarting...."
    sh Start.sh
fi
