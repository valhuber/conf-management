#!/bin/sh
while true
do
	echo "Press [CTRL+C] to stop.."
	if [ -d "HCLDevopsDemo" ] 
	then
	    echo "Directory HCLDevopsDemo exists." 
	    cd HCLDevopsDemo
		git fetch --all
		LOCAL=$(git rev-parse HEAD)
		REMOTE=$(git rev-parse @{u})

		if [ $LOCAL = $REMOTE ]; then
	    	echo "Up-to-date"
	    	cd ..
		else
	    	echo "Needs a pull"
	    	git stash
	    	git reset --hard origin/master
	    	git stash pop
	    	cd ..
	    	zip -r HCLDevopsDemo.zip HCLDevopsDemo

			echo "Repository Updated, start import!!"


			lacadmin login -u admin -p Password1 http://localhost:8080 -a local
			lacadmin use local
			lacadmin api import --file HCLDevopsDemo.zip --namecollision replace_existing
			lacadmin logout -a local
		fi
	else
	    echo "Error: Directory HCLDevopsDemo does not exists."
	    git clone https://github.com/EspressoLogicCafe/HCLDevopsDemo.git

		zip -r HCLDevopsDemo.zip HCLDevopsDemo

		echo "Repository Cloned, and zipped start import!!"

		lacadmin login -u admin -p Password1 http://localhost:8080 -a local
		lacadmin use local
		lacadmin api import --file HCLDevopsDemo.zip --namecollision replace_existing
		lacadmin logout -a local
	fi
	sleep 10
done
