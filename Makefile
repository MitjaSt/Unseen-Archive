include Makefile.misc.inc

# Declare phony targets
.PHONY: start-dev test test-ci


# Development
start-dev:
	$(call log, Clearing out dist folder ...)
	rm -rf dist
	$(call log, Running Vite dev server on port $(DEV_SERVER_PORT)...)
	npm run dev -- --port $(DEV_SERVER_PORT)


# Build
build:
	$(call log, Building extension ...)
	npm run build:extension

build-preview: build
	$(call log, Running Vite preview ...)
	npm run preview


# Tests
test: # Watched
	$(call log, Running tests ...)
	npm test

test-ci:
	$(call log, Running CI tests ...)
	npm test -- --run

test-ui:
	$(call log, Running UI tests ...)
	npm run test:ui

test-coverage:
	$(call log, Running tests with coverage ...)
	npm run test:coverage
