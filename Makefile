include Makefile.misc.inc

# Declare phony targets
.PHONY: start-dev test test-ci

# Development
start-dev:
	$(call log, Clearing out .next folder ...)
	rm -rf .next
	$(call log, Running dev server on port $(DEV_SERVER_PORT)...)
	npm run dev -- -p $(DEV_SERVER_PORT)

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
