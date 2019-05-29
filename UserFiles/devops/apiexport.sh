#! /bin/bash
lacadmin login -u admin -p Password1 http://localhost:8080 -a local
lacadmin use local
lacadmin api export --url_name testdevops --file testdevops.json --format json --passwordstyle skip
lacadmin logout -a local

