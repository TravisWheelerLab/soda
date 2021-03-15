#! /bin/bash

cp webpack.config-test.js $1/webpack.config.js
cd $1
ln -sf ../test-makefile Makefile
ln -sf ../tsconfig-test.json tsconfig.json
ln -sf ../ann.ts
