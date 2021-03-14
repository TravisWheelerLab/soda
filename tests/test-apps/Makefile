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
build: builddir
	cd rectangles && make build
	cd lines && make build
	cd chevron-lines && make build
	cd chevron-rectangles && make build
	cd build && ln -sfn ../rectangles/build ./rectangles
	cd build && ln -sfn ../lines/build ./lines
	cd build && ln -sfn ../chevron-lines/build ./chevron-lines
	cd build && ln -sfn ../chevron-rectangles/build ./chevron-rectangles

### serve
### -----
### Build and serve the example app on port 8080.
###
.PHONY: serve
serve:
	@echo "SERVE invoked at $$(date)"
	@echo "Running server on localhost:8080"
	@echo "Use ctrl-c to stop"
	@python3 -m http.server -d build/ -b localhost 8080 && echo "Bye bye!"

### clean
### -----
### Remove files from the build process
###
.PHONY: clean
clean:
	rm -rf build/
	cd single-track-rectangles && make clean
	cd click-and-hover && make clean
	cd graph-color-layout && make clean

### setup
### -----
### Install development dependencies, run this first!
###
.PHONY: setup
setup:
	@npm install --include=dev
	@echo "You will also need wget to run the example"

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
