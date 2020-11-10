.PHONY: build

TIMESHEETSDB_VERSION := latest

build: # @HELP build the Web GUI and run all validations (default)
build: deps
	npm run build

test: # @HELP run the unit tests and source code validation
test: deps build lint license_check
	npm run test

deps: # @HELP ensure that the required dependencies are in place
	npm install

lint: # @HELP run the linters for Typescript source code
	npm run lint

license_check: # @HELP examine and ensure license headers exist
	@if [ ! -d "../build-tools" ]; then cd .. && git clone https://github.com/onosproject/build-tools.git; fi
	./../build-tools/licensing/boilerplate.py -v --rootdir=${CURDIR}

timesheetsdb-docker: # @HELP build timesheetsdb Docker image
	docker build . -f build/timesheetsdb/Dockerfile \
		-t onosproject/timesheetsdb:${TIMESHEETSDB_VERSION}

images: # @HELP build all Docker images
images: build timesheetsdb-docker

all: build images

publish: # @HELP publish version on github and dockerhub
	./../build-tools/publish-version ${VERSION}

clean: # @HELP remove all the build artifacts
	rm -rf ./timesheetsdb/dist ./timesheetsdb/node_modules

help:
	@grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST) \
    | sort \
    | awk ' \
        BEGIN {FS = ": *# *@HELP"}; \
        {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}; \
    '
