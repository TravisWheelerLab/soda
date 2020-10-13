### ----------------
### Welcome to the Makefile, we hope you enjoy your stay! Run
### `make help` for help.
###

## --------------
## Public Targets
## --------------

### setup
### -----
### Install development dependencies, run this first!
###
.PHONY: setup
setup:
	@npm install --dev
	@echo "You will also need wget to run the example"

## This lives way down here because it screws up the syntax highlighting
## for the rest of the file if it's higher up. Basically, we just grep
## the Makefile for special comments and barf out those lines.
MAGIC_COMMENT := \#\#\#
help:
	@cat Makefile | grep '^$(MAGIC_COMMENT)' | \
	sed 's/$(MAGIC_COMMENT) //' | sed 's/$(MAGIC_COMMENT)//' | less
