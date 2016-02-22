install:
	npm install --global babel-cli
	npm install babel-preset-react

build:
	cd public &&\
	babel --presets react src --watch --out-dir build


