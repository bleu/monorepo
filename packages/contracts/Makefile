.PHONY: patch_balancer_contracts

REPLACE="'@balancer-labs/=../../node_modules/@balancer-labs/'"
ESCAPED_REPLACE := $(shell printf '%s\n' "$(REPLACE)" | sed -e 's/[\/&]/\\&/g')

patch_balancer_contracts:
    # Workaround for Balancer's own pkg naming convention and foundry.toml @balancer-labs/ remapping.
    # That is also why we have to link their packages to node_modules in package.json
    # and create some issues during verification (although this could also be related to some other
    # inconsistensy/bug in the way we setup stuff or in foundry's build/verify). 
    # Ideally we'd be able to override the remapping in foundry.toml, but that doesn't seem to be possible.
	@echo $(ESCAPED_REPLACE)
	@sed "/$(ESCAPED_REPLACE)/ s/./#&/" lib/balancer-v2-monorepo/foundry.toml > lib/balancer-v2-monorepo/foundry.toml
	$(eval MATCHES=$(shell forge tree 2>&1 | grep -ci node_modules))
	@if [ $(MATCHES) != 0 ]; then\
		echo "❌ node_modules found in forge tree, there was an issue with the patch";\
	else\
        echo "✅ Good to go, node_modules not found in forge tree";\
    fi