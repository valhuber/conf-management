#! /bin/bash
lacadmin login -u admin -p Password1 http://localhost:8080 -a local
lacadmin use local
lacadmin api import --file testdevops.json --namecollision replace_existing
lacadmin logout -a local

