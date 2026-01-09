include Makefile.misc.inc

# Declare phony targets
.PHONY: start-dev

start-dev:
	$(call log, Clearing out .next folder ...)
	rm -rf .next
	$(call log, Running dev server on port $(DEV_SERVER_PORT)...)
	npm run dev -- -p $(DEV_SERVER_PORT)