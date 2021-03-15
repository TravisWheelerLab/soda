#! /bin/bash

cp webpack.config-test.js $1/webpack.config.js
ln -sf ./test-makefile $1/Makefile
ln -sf ./tsconfig-test.json $1/tsconfig.json
ln -sf ./ann.ts $1
