.PHONY: all clean test run build upgrade prologue help

all: 		 					# default action
	@[ -f .git/hooks/pre-commit ] || pre-commit install --install-hooks
	@git config commit.template .git-commit-template

clean: 							# clean-up environment
	@find . -name '*.sw[po]' -delete
	@rm -rf dist/ node_modules/

test:							# run test

run: build						# run in the local environment
	python3 -m http.server

build: node_modules				# build the binary/library
	@pnpm run lint
	@pnpm run build && cp dist/planb.js examples/

upgrade:						# upgrade all the necessary packages
	pre-commit autoupdate

help:							# show this message
	@printf "Usage: make [OPTION]\n"
	@printf "\n"
	@perl -nle 'print $$& if m{^[\w-]+:.*?#.*$$}' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?#"} {printf "    %-18s %s\n", $$1, $$2}'

node_modules: package.json pnpm-lock.yaml
	pnpm install
