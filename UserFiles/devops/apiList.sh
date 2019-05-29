#! /bin/bash
lacadmin login -u admin -p Password1 http://localhost:8080 -a local
lacadmin use local
lacadmin api list
lacadmin logout -a local

