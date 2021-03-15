#! /bin/bash

cp webpack.config-example.js $1/webpack.config.js
cd $1
ln -sf ../example-makefile Makefile
ln -sf ../tsconfig-example.json tsconfig.json
