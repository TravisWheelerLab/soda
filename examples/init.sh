#! /bin/bash

cp webpack.config-example.js $1/webpack.config.js
ln -sf $PWD/example-makefile $1/Makefile
ln -sf $PWD/tsconfig-example.json $1/tsconfig.json
