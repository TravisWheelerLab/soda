#! /bin/bash
ex=$(pwd)
for d in */ ; do
    if [ "$d" != 'node_modules/' ]; then
        echo "building $ex/$d"
        cd $ex/$d && npx tsc 
    fi
done
