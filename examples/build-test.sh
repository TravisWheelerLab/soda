#! /bin/bash
ex=$(pwd)
for d in */ ; do
    if [ "$d" != 'node_modules/' ]; then
        cd $ex/$d && make build
    fi
done
