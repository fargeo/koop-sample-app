const config = require('config')
const Koop = require('koop')
const koop = new Koop(config)

const tile = require('@koopjs/output-vector-tiles')
const geojson = require("koop-output-geojson");

// outputs
koop.register(geojson);
koop.register(tile);

// providers
const provider = require('./arches')

// register koop providers
koop.register(provider);

// This is how you implement additional arbitrary routes on the Koop server
koop.server.get('/', function (req, res) {
  res.status(200).send(`
Welcome to Koop!

Installed Providers:
Arches

`)
})

const port = config.port || 8080
// start the server
koop.server.listen(port, () => koop.log.info(`Koop server listening at ${port}`))
