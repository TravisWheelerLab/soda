### ----------------
### Welcome to the Makefile, we hope you enjoy your stay! Run
### `make help` for help.
###

## --------------
## Public Targets
## --------------

### build
### -----
###
.PHONY: build
build:
	tsc --build tsconfig-scripts.json

### build
### -----
###
.PHONY: bench
bench: build
	mkdir -p benchmark-results/
	node js/benchmarks.js

### clean
### -----
### Remove files from the build process
###
.PHONY: clean
clean:
	rm -rf js/

## ---------------
## Private Targets
## ---------------

builddir:
	mkdir -p build/


## This lives way down here because it screws up the syntax highlighting
## for the rest of the file if it's higher up. Basically, we just grep
## the Makefile for special comments and barf out those lines.
MAGIC_COMMENT := \#\#\#
help:
	@cat Makefile | grep '^$(MAGIC_COMMENT)' | \
	sed 's/$(MAGIC_COMMENT) //' | sed 's/$(MAGIC_COMMENT)//' | less
