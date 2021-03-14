#! /bin/bash

cp webpack.config-test.js $1/webpack.config.js
ln -sf $PWD/test-makefile $1/Makefile
ln -sf $PWD/tsconfig-test.json $1/tsconfig.json
ln -sf $PWD/ann.ts $1
