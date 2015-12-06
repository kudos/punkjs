token = $(shell curl -s "https://accounts.google.com/o/oauth2/token" -d "client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&refresh_token=${OAUTH_REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq '.access_token')

.PHONY: app ext
all: app ext

app: app-prep build upload

ext: ext-prep build upload

app-prep:
	$(eval ID = "ecnapnimgoienbogbgcmchpgjbgeaobk")
	$(eval TYPE = "app")

ext-prep:
	$(eval ID = "dkjpmglejjkidbgnokkgkiablgbdabpk")
	$(eval TYPE = "ext")
	@echo "Check that the client is using the right ID for the server"
	grep ecnapnimgoienbogbgcmchpgjbgeaobk ext/bridge-id.js

build:
	@echo "Building ./${TYPE}"
	mkdir -p dist
	rm -f dist/${TYPE}.zip
	zip -r dist/${TYPE}.zip ${TYPE}/* -x Makefile

upload:
	curl -s -H "Authorization: Bearer $(token)" -H "x-goog-api-version: 2" -X PUT -T dist/${TYPE}.zip https://www.googleapis.com/upload/chromewebstore/v1.1/items/${ID}

publish:
	curl -H "Authorization: Bearer $(token)" -H "x-goog-api-version: 2"	-H "Content-Length: 0"-X POST	-v	https://www.googleapis.com/chromewebstore/v1.1/items/${ID}
