# Logging
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

define log
@echo "$(YELLOW)[LOG] $(BLUE)$(1)$(NC)"
endef

define error
@echo "$(RED)[ERROR] $(1)$(NC)"
endef


# Variables
DEV_SERVER_PORT := 3030