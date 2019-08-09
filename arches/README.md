# Koop Arches Provider

This is a sample that demonstrates how to build a Koop Provider. You can clone this project, and use it to start a new provider. This sample can run a local server, deploy to AWS Lambda or Docker for testing and operations. Once the provider is published to NPM, then it can be used with other Koop providers and outputs in a larger project.

The data source in this example is the [TriMet Bus API](https://developer.trimet.org). You can see this provider in action [here](http://dcdev.maps.arcgis.com/home/item.html?id=2603e7e3f10742f78093edf8ea2adfd8#visualize).

Full documentation is provided [here](https://koopjs.github.io/docs/usage/provider).

## Getting started

1. Open `config/default.json` with any configurable parameters
1. Open `model.js` and implement `getData` to call your provider and return GeoJSON
1. Install dependencies `yarn install`
1. Run a local server `yarn start`
1. Add tests to `test/`

## Koop provider file structure

| File | | Description |
| --- | --- | --- |
| `index.js` | Mandatory | Configures provider for usage by Koop |
| `model.js` | Mandatory | Translates remote API to GeoJSON |
| `routes.js` | Optional | Specifies additional routes to be handled by this provider |
| `controller.js` | Optional | Handles additional routes specified in `routes.js` |
| `server.js` | Optional | Reference implementation for the provider |
| `test/model-test.js` | Optional | tests the `getData` function on the model |
| `test/fixtures/input.json` | Optional | a sample of the raw input from the 3rd party API |
| `config/default.json` | Optional | used for advanced configuration, usually API keys. |


## Test it out
Run server:
- `yarn install`
- `yarn start`

Example API Query:
- `curl localhost:8080/arches/FeatureServer/0/query?returnCountOnly=true`

Tests:
- `yarn run test`

### Development output callstack logs

During development you can output error callstack with

- `NODE_ENV=test yarn start`


## Deploy to AWS Lambda

Koop providers can be quickly deployed and scaled with AWS Lambda. To first create the service:

- `yarn run lambda-create`

To deploy code updates

- `yarn run lambda-update`

### AWS Lambda configuration

By default, AWS Lambda has a 3 second timeout and only 128MB memory. If your Koop provider uses a slower service, then you should change the AWS Lambda timeout to a higher time limit (e.g. 60 seconds) as well as add more memory (e.g. 512MB).

## With Docker

- `docker build -t koop-provider-arches .`
- `docker run -it -p 8080:8080 koop-provider-arches`

## Publish to npm

- run `npm init` and update the fields
  - Choose a name like `koop-provider-foo`
- run `npm publish`
