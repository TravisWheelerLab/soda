#! /bin/bash

for d in */ ; do
    if [ "$d" != 'node_modules/' ]; then
        ./init.sh $d
    fi
done
